// mon_register/src/styles/theme.js

// カラーパレット
export const colors = {
  primary: "#1E90FF",       // メインアクションカラー
  secondary: "#FFC107",     // サブアクションカラー
  background: "#F9FAFB",    // 背景色
  surface: "#FFFFFF",       // コンテナ背景色
  textPrimary: "#212121",   // メインテキスト
  textSecondary: "#757575", // 補助テキスト
  border: "#E0E0E0",        // 境界線
};

// フォントサイズ
export const fontSizes = {
  xs: "0.75rem",  // 12px
  sm: "0.875rem", // 14px
  md: "1rem",     // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem",  // 20px
};

// スペーシング（マージン／パディング）
export const spacing = {
  none: "0",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
};

// ブレークポイント（レスポンシブ）
export const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
};

// テーマオブジェクトをまとめて default export
const theme = {
  colors,
  fontSizes,
  spacing,
  breakpoints,
};

export default theme;
