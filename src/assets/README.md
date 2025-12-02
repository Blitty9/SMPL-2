# Assets Directory

Place your logo and other image assets here.

## Logo Files

Add your logo image files here:
- `logo.svg` or `logo.png` - Main logo
- `logo-icon.svg` or `logo-icon.png` - Icon version (for favicon)
- `logo-dark.svg` or `logo-dark.png` - Dark background version (if needed)

## Usage

Import images in your components like this:

```typescript
import logo from '../assets/logo.svg';
import logoIcon from '../assets/logo-icon.svg';

// Then use in JSX:
<img src={logo} alt="SMPL Logo" />
```

