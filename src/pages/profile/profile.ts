import {Block, Router, Store} from "../../core";
import {getFormData} from "../../utils";
import {withRouter} from "../../utils/withRouter";
import {withStore} from "../../utils/withStore";
import {initApp, logout, sendProfile, changePassword, setAvatar} from "../../services";
import {ProfilePayload, PasswordPayload} from "../../api/profile/types";

interface ProfilePageProps {
  router: Router;
  store: Store<AppState>;
  onLogout?: () => void;
  isProfileSending?: () => boolean;
  isAvatarSending?: () => boolean;
  isPasswordSending?: () => boolean;
  getUser?: () => User | null;
  sendProfileError?: () => string | null;
  sendAvatarError?: () => string | null;
  sendPasswordError?: () => string | null;
  avatar?: () => string | null | undefined;
  firstName?: () => string;
  secondName?: () => string;
  displayName?: () => string;
  login?: () => string;
  email?: () => string;
  phone?: () => string;
}

class ProfilePage extends Block<ProfilePageProps> {
  static componentName = 'ProfilePage';

  constructor(props: ProfilePageProps) {
    super(props);

    this.setProps({
      isProfileSending: () => this.props.store.getState().isProfileSending,
      isAvatarSending: () => this.props.store.getState().isAvatarSending,
      isPasswordSending: () => this.props.store.getState().isPasswordSending,
      sendProfileError: () => this.props.store.getState().sendProfileError,
      sendAvatarError: () => this.props.store.getState().sendAvatarError,
      sendPasswordError: () => this.props.store.getState().sendPasswordError,
      avatar: () => `https://ya-praktikum.tech/api/v2/resources${this.props.store.getState().user?.avatar || ''}`,
      firstName: () => this.props.store.getState().user?.first_name || '',
      secondName: () => this.props.store.getState().user?.second_name || '',
      displayName: () => this.props.store.getState().user?.display_name || '',
      login: () => this.props.store.getState().user?.login || '',
      email: () => this.props.store.getState().user?.email || '',
      phone: () => this.props.store.getState().user?.phone || '',
    });
  }

  componentDidMount() {
    this.props.store.dispatch(initApp);
  }

  protected getStateFromProps() {
    this.state = {
      onSaveProfile: (e: MouseEvent) => {
        e.preventDefault();
        const values = getFormData('#profile-form') as ProfilePayload;
        if (values) {
          this.props.store.dispatch(sendProfile, values);
        }
      },
      onChangePassword: (e: MouseEvent) => {
        e.preventDefault();
        const values = getFormData('#password-form') as PasswordPayload;
        if (values) {
          this.props.store.dispatch(changePassword, values);
        }
      },
      onSetAvatar: (e: MouseEvent) => {
        e.preventDefault();
        const inputFile = document.getElementById("avatar") as HTMLInputElement;
        const formData: any = new FormData();
        if (inputFile.files && inputFile!.files[0]) {
          formData.append("avatar", inputFile!.files[0]);
          this.props.store.dispatch(setAvatar, formData);
        }
      },
      onChat: () => window.router.go('/messenger'),
      onLogout: () => this.props.store.dispatch(logout),
    };
  }

  render() {
    // language=hbs
    return `
      <main>
        <div class="profile-form__wrapper">
          {{{FormHeader title="Профиль"}}}
          <form enctype="multipart/form-data" method="post" class="avatar-form" id="avatar-form">
            <label for="avatar" class="form-item__label">Аватар</label>
            <div class="avatar-form__input-block">
              <input type="file" name="avatar" id="avatar" multiple accept="image/*,image/jpeg" class="avatar-form__file-input">
              <div class="avatar-form__image-wrapper">
                {{{Avatar avatarSrc=avatar}}}
              </div>
              {{{AvatarFormButton isLoading=isAvatarSending onClick=onSetAvatar}}}
            </div>
            {{{FormError text=sendAvatarError}}}
          </form>
          <form action="#" class="profile-form" method="post" id="profile-form">
            <div class="profile-form__inputs-wrapper">
              {{{FormItem inputName="first_name" labelName="Имя" type="text" className="form-item--row" value=firstName}}}
              {{{FormItem inputName="second_name" labelName="Фамилия" type="text" className="form-item--row" value=secondName}}}
              {{{FormItem inputName="display_name" labelName="Имя пользователя" type="text" className="form-item--row" value=displayName}}}
              {{{FormItem inputName="login" labelName="Логин" type="text" className="form-item--row" value=login}}}
              {{{FormItem inputName="email" labelName="Email" type="email" className="form-item--row" value=email}}}
              {{{FormItem inputName="phone" labelName="Телефон" type="tel" className="form-item--row" value=phone}}}
              {{{FormError text=sendProfileError}}}
              <div class="profile-form__buttons-wrapper">
                {{{FormButton text="Сохранить" onClick=onSaveProfile className="form-button--green" isLoading=isProfileSending}}}
              </div>
            </div>
          </form>
          <form action="#" class="profile-form" method="post" id="password-form">
            <div class="profile-form__inputs-wrapper">
              {{{FormItem inputName="oldPassword" labelName="Старый пароль" type="password" className="form-item--row"}}}
              {{{FormItem inputName="newPassword" labelName="Новый пароль" type="password" className="form-item--row"}}}
              {{{FormError text=sendPasswordError}}}
              <div class="profile-form__buttons-wrapper">
                {{{FormButton text="Изменить пароль" onClick=onChangePassword className="form-button--green" isLoading=isPasswordSending}}}                  
              </div>
            </div>
            <div class="profile-form__buttons-wrapper">
              {{{FormButton text="Перейти в мессенджер" onClick=onChat className="form-button" noSubmit=true}}}
              {{{FormButton text="Выход из приложения" onClick=onLogout className="form-button--red" noSubmit=true}}}
            </div>
          </form>
        </div>
      </main>
    `;
  }
}

export default withRouter(withStore(ProfilePage));