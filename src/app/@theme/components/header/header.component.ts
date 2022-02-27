import {AfterViewInit, Component, EventEmitter, Injectable, OnDestroy, OnInit, Output} from '@angular/core';
import {
  NbDialogService,
  NbIconLibraries,
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService
} from '@nebular/theme';

import {LayoutService} from '../../../@core/utils';
import {map, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AuthoritiesConstant} from '../../../authorities.constant';
import {AccountService} from '../../../@core/auth/account.service';
import {ChangePasswordComponent} from '../../../auth-routing/change-password/change-password.component';
import {LanguageService} from '../../../@core/mock/language.service';
import {TranslateService} from '@ngx-translate/core';
import {ShareDataBreadcrumbService} from '../../../services/share-data-breadcrumb.service';

// import {SessionStorageService} from "ngx-webstorage";


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() emitSelectWidth = new EventEmitter<boolean>();
  authoritiesConstant = AuthoritiesConstant;
  userPictureOnly: boolean = false;
  user: any;
  dataBreadCrumb: any;
  checkWidth: boolean = false;
  selectedItemS = '2'
  selectedItem;
  theme: any = 'theme-dark';
  isDark = true;
  toggleThemes: boolean = false;
  selectedItemNgModel: any;
  subscription: Subscription | undefined;
  lang = 'vi';
  langType = 2;
  listLanguageType = [{name: 'English', value: 2, url: './assets/images/english.svg'}, {
    name: 'Viet nam',
    value: 1,
    url: './assets/images/vietnamese.svg'
  }];
  systemConfigMenus = [
    {
      menu: 'DB make file config',
      name: 'Cấu hình make file DB',
      icon: 'file-text-outline',
      link: 'config-makeFile-db',
      auth: 'CONFIG_MAKE_FILE_DB'
    },
    {
      menu: 'SMS alert config',
      name: 'Cấu hình tin nhắn cảnh báo',
      icon: 'settings-2-outline',
      link: 'sms-alert-config',
      auth: 'ALERT_CONFIG'
    },
    // {menu: 'LB connection manager', name: 'Quản lý kết nối LB', icon: '', link:''},
    {
      menu: 'User manager',
      name: 'Quản lý người dùng',
      icon: 'people-outline',
      link: '/pages/user-management',
      auth: this.authoritiesConstant.ROLE_ADMIN
    },
    {
      menu: 'Role management',
      name: 'Quản lý phân quyền',
      icon: 'lock-outline',
      link: '/pages/role-management',
      auth: this.authoritiesConstant.ROLE_ADMIN
    },
    {
      menu: 'Module management',
      name: 'Quản lý Module',
      icon: 'layers-outline',
      link: '/pages/module-management',
      auth: this.authoritiesConstant.ROLE_ADMIN
    }
  ];
  utilityMenus = [
    {
      menu: 'ETL job lib',
      name: 'Thư viện ETL job',
      icon: 'pantone-outline',
      link: 'job-management',
      auth: 'JOB_MANAGEMENT'
    },
    {menu: 'Encode tool', name: 'Công cụ mã hóa', icon: 'code-outline', link: 'encode-tool', auth: 'ENCODE'},
    {
      menu: 'Export file',
      name: 'Xuất file',
      icon: 'link-2-outline',
      link: 'export-file',
      auth: 'EXPORT_FILE'
    },
    {
      menu: 'Upload file to server',
      name: 'Upload file lên server',
      icon: 'upload-outline',
      link: 'upload-file',
      auth: 'UPLOAD_FILE'
    },
    {
      menu: 'HDFS browser',
      name: 'HDFS browser',
      icon: 'archive-outline',
      link: 'hdfs-browser',
      auth: 'HDFS_BROWSER'
    },
    {
      menu: 'Atlas update',
      name: 'Cập nhật Atlas',
      icon: 'sync-outline',
      link: 'update-atlas',
      auth: 'ATLAS_UPDATE'
    },

  ];
  systemConfigMenusLink = [];
  systemConfigMenusAuth = [];
  utilityMenusLink = [];
  utilityMenusAuth = [];
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    }
  ];
  currentTheme = 'dark';
  userMenu = [{title: 'Đổi mật khẩu', target: 'changePassword'}, {
    title: 'Đăng xuất',
    target: 'logout'
  }];
  userMenu1 = [{title: 'Đăng xuất', target: 'logout'}];
  private messageSource = new BehaviorSubject('Default message');
  currentMessage = this.messageSource.asObservable();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private shareData: ShareDataBreadcrumbService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private accountService: AccountService,
              private dialogService: NbDialogService,
              private breakpointService: NbMediaBreakpointsService,
              private languageService: LanguageService,
              private translateService: TranslateService,
              public router: Router,
              // private languageService: JhiLanguageService,
              private iconsLibrary: NbIconLibraries) {
    iconsLibrary.registerFontPack('fa', {packClass: 'fa', iconClassPrefix: 'fa'});
    this.selectedItem = this.listLanguageType[1];
    this.shareData.siblingData.subscribe(res => {
      this.dataBreadCrumb = res
    })
    // this.subscription = this.shareData.getData().subscribe(res => {
    //   this.dataBreadCrumb = res;
    //   console.log(res)
    // });
  }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  ngAfterViewInit() {
    // this.toggleSidebar()
  }

  ngOnInit() {
    if (localStorage.getItem('theme')) {
      this.theme = localStorage.getItem('theme');
      if (localStorage.getItem('theme') === 'theme-light') {
        this.toggleThemes = true;
      } else {
        this.toggleThemes = false;
      }
    }
    const html = document.querySelector('html');
    if (html) {
      html.dataset.theme = this.theme;
    }
    this.utilityMenus.forEach(i => {
      this.utilityMenusLink.push(i.link);
      this.utilityMenusAuth.push(i.auth);
    });
    this.systemConfigMenus.forEach(i => {
      this.systemConfigMenusLink.push(i.link);
      this.systemConfigMenusAuth.push(i.auth);
    });
    // this.systemConfigMenusLink = this.systemConfigMenus.map(menu => menu.link);
    this.currentTheme = this.themeService.currentTheme;
    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => {
    //     this.user = users.nick;
    //     console.log(users);
    //   });
    this.checkActiveRoute('params');
    this.menuService.onItemClick()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
          if (event.item.target === 'logout') {
            this.router.navigate(['auth/logout']);
          }
          if (event.item.target === 'changePassword') {
            // this.router.navigate(['auth/change-password']);
            const ref = this.dialogService.open(ChangePasswordComponent, {
              closeOnBackdropClick: false,
              closeOnEsc: false,
              context: {},
            });
          }
          // if (event.item.target === 'favorite') {
          //   this.openDialogInsertFavorite();
          // }
        }
      );
    // this.user = {name: 'admin'};
    this.accountService.identity().subscribe(res => {
      this.user = res;
    }, (error => {
      console.log('error', error)
    }));
    const {xl} = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({name}) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
    this.currentLanguage();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkActiveRoute(params) {
    if (!params) return;
    if (typeof params === 'string') {
      params = [params];
    }
    const pathname = window.location.pathname;
    return params.some(p => pathname.includes(p));
  }

  // changeTheme(themeName: string) {
  //   this.themeService.changeTheme(themeName);
  // }

  toggleSidebar(): boolean {
    this.checkWidth = !this.checkWidth;
    console.log(this.checkWidth);
    this.emitSelectWidth.emit(this.checkWidth);
    this.sidebarService.toggle(true, 'menu-sidebar');
    // this.layoutService.changeLayoutSize();
    this.changeMessage(true);
    return false;
  }

  changeTheme(): void {
    const html = document.querySelector('html');
    if (this.isDark && html) {
      html.dataset.theme = `theme-light`;
      this.isDark = false;
      this.toggleThemes = true;
      localStorage.setItem('theme', 'theme-light');
      return;
    }
    if (!this.isDark && html) {
      html.dataset.theme = `theme-dark`;
      localStorage.setItem('theme', 'theme-dark');
      this.isDark = true;
      this.toggleThemes = false;
    }
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  convertEmail(user: any) {
    if (user.email == null) return 'Unknown';
    return user.email.substring(0, user.email.lastIndexOf('@'));
  }

  changeLanguage(languageKey: string) {
    // this.languageService.changeLanguage(languageKey);
    // this.langKey = languageKey;
  }

  selectLanguageEN() {
    this.translateService.use('en');
  }

  selectLanguageVI() {
    this.translateService.use('vi');
  }


  selectLanguage() {
    if (this.langType === 1) {
      this.translateService.use('vi');
    } else {
      this.translateService.use('en');
    }
  }

  fullScreen(key: string) {
    const elem = document.documentElement;
    const methodToBeInvoked = elem.requestFullscreen || elem['mozRequestFullscreen'] || elem['msRequestFullscreen'];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
    if (key === 'fullScreen') {
      const elemClose = document;
      const cancellFullScreen = elemClose.exitFullscreen || elemClose['mozCancelFullScreen'] || elemClose['webkitExitFullscreen'] || elemClose['msExitFullscreen'];
      cancellFullScreen.call(elemClose);
    }
  }

  private currentLanguage() {
    return this.languageService.translate.currentLang;
  }
}
