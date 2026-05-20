### ite4_finalproj

## commands
- flutter create ite4_finalproj
- flutter upgrade # to upgrade your flutter
- flutter pub get # to download and install the packages (dependencies) your app needs.
- flutter clean # deletes temporary build files and cached project outputs.
- flutter pub add flutter-package-name # to install package
- flutter run # to run your project


## packages/libraries
- flutter_riverpod
- dio
- flutter_screenutil
- cached_network_image
- flutter_secure_storage
- google_fonts
- image_picker
- flutter_dotenv


## File and Folder structure
```
assets # store images/logo
lib/
├── main.dart                              # Entry point (ProviderScope)
├── app.dart                               # MaterialApp + ScreenUtil + Theme + Routes
│
├── core/                                  # App-wide infrastructure
│   ├── constants/
│   │   ├── api_constants.dart             # Base URL, endpoints, timeouts
│   │   ├── app_colors.dart                # Color palette (brand, semantic, surface, text)
│   │   └── app_strings.dart               # Static UI strings
│   ├── network/
│   │   ├── api_interceptor.dart           # Dio interceptor: token injection + 401 handling
│   │   └── dio_client.dart                # Shared Dio provider (Riverpod)
│   ├── router/
│   │   └── app_router.dart                # Named routes + onGenerateRoute
│   ├── storage/
│   │   └── secure_storage.dart            # Token read/write/delete (flutter_secure_storage)
│   ├── theme/
│   │   └── app_theme.dart                 # Light + Dark ThemeData (colors, fonts, components)
│   └── utils/
│       ├── toast_helper.dart              # SnackBar utility (success/error/info/warning)
│       └── responsive.dart                # Breakpoint helpers (mobile/tablet/desktop)
│
├── models/                                # Data classes
│   ├── user_model.dart                    # User data model
│   └── auth/
│       └── login_state.dart               # Login form state (loading, errors, success)
│
├── services/                              # Raw API calls (Dio layer)
│   ├── auth_service.dart                  # login(), logout(), getUser()
│   └── user_service.dart                  # getUsers()
│
├── providers/                             # Riverpod state management
│   ├── auth_provider.dart                 # Global auth state (token, user, isAuthenticated)
│   ├── login_provider.dart                # Login form notifier
│   └── user_provider.dart                 # User list FutureProvider
│
├── widgets/                               # Reusable UI components
│   ├── app_input_field.dart               # Full-featured text input
│   ├── app_button.dart                    # Button with loading + outlined variant
│   ├── app_logo.dart                      # Centralized app logo
│   ├── app_loading.dart                   # Styled loading indicator
│   ├── cached_image_widget.dart           # Network image with cache
│   └── user_card.dart                     # User list card
│
└── screens/                               # Full-page screens
    ├── splash/
    │   └── splash_screen.dart             # Animated splash → auth check → navigate
    ├── auth/
    │   └── login_screen.dart              # Login form with validation
    └── main/
    │    ├── main_screen.dart               # Bottom nav shell (IndexedStack)
    │    ├── home_screen.dart               # Home tab (welcome + dashboard)
    │    ├── users_screen.dart              # Users tab (list from API)
    │    └── profile_screen.dart            # Profile tab (user info + logout)
    └── users/                              
        ├── create_user_screen.dart
        ├── edit_user_screen.dart
        ├── view_user_dart.
```