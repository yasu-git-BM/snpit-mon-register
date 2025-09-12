// mon_register/src/styles/theme.js

// �J���[�p���b�g
export const colors = {
  primary: "#1E90FF",       // ���C���A�N�V�����J���[
  secondary: "#FFC107",     // �T�u�A�N�V�����J���[
  background: "#F9FAFB",    // �w�i�F
  surface: "#FFFFFF",       // �R���e�i�w�i�F
  textPrimary: "#212121",   // ���C���e�L�X�g
  textSecondary: "#757575", // �⏕�e�L�X�g
  border: "#E0E0E0",        // ���E��
};

// �t�H���g�T�C�Y
export const fontSizes = {
  xs: "0.75rem",  // 12px
  sm: "0.875rem", // 14px
  md: "1rem",     // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem",  // 20px
};

// �X�y�[�V���O�i�}�[�W���^�p�f�B���O�j
export const spacing = {
  none: "0",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
};

// �u���[�N�|�C���g�i���X�|���V�u�j
export const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
};

// �e�[�}�I�u�W�F�N�g���܂Ƃ߂� default export
const theme = {
  colors,
  fontSizes,
  spacing,
  breakpoints,
};

export default theme;
