const AUTH_STORAGE_KEY = 'engineerOS:auth';
const SESSION_KEY = 'engineerOS:sessionActive';

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

function hasAccount() {
  return localStorage.getItem(AUTH_STORAGE_KEY) !== null;
}

function getAccount() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function createAccount(username, email, password, securityAnswer) {
  const record = {
    username: username,
    email: email,
    passwordHash: simpleHash(password),
    securityAnswerHash: simpleHash(securityAnswer.trim().toLowerCase())
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(record));
}

function checkCredentials(username, password) {
  const account = getAccount();
  if (!account) return false;
  return account.username === username && account.passwordHash === simpleHash(password);
}

function checkSecurityAnswer(answer) {
  const account = getAccount();
  if (!account) return false;
  return account.securityAnswerHash === simpleHash(answer.trim().toLowerCase());
}

function updatePassword(newPassword) {
  const account = getAccount();
  if (!account) return;
  account.passwordHash = simpleHash(newPassword);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account));
}

function resetAccount() {
  const confirmed = window.confirm(
    'This will erase your login and require creating a new account. It does NOT delete your tasks, habits, or other data. Continue?'
  );
  if (confirmed) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }
}

function unlockApp() {
  sessionStorage.setItem(SESSION_KEY, 'true');

  const lockScreen = document.getElementById('lock-screen');
  const appContent = document.getElementById('app-content');

  lockScreen.classList.add('is-unlocked');
  appContent.classList.remove('app-content--locked');

  setTimeout(() => {
    lockScreen.style.display = 'none';
  }, 400);
}

function lockApp() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.reload();
}

function setupLockScreen() {
  const lockTitle = document.getElementById('lock-title');
  const lockSubtitle = document.getElementById('lock-subtitle');
  const lockForm = document.getElementById('lock-form');
  const usernameInput = document.getElementById('lock-username');
  const emailField = document.getElementById('lock-email-field');
  const emailInput = document.getElementById('lock-email');
  const passwordInput = document.getElementById('lock-password');
  const securityField = document.getElementById('lock-security-field');
  const securityInput = document.getElementById('lock-security-answer');
  const lockError = document.getElementById('lock-error');
  const lockSubmitBtn = document.getElementById('lock-submit-btn');
  const forgotBtn = document.getElementById('lock-forgot-btn');

  const accountExists = hasAccount();
  const sessionActive = sessionStorage.getItem(SESSION_KEY) === 'true';

  if (accountExists && sessionActive) {
    unlockApp();
    return;
  }

  if (accountExists) {
    const account = getAccount();
    lockTitle.textContent = 'Welcome back';
    lockSubtitle.textContent = `Log in as ${account.username}.`;
    lockSubmitBtn.textContent = 'Log in';
    usernameInput.value = account.username;
    emailField.style.display = 'none';
    securityField.style.display = 'none';
    forgotBtn.style.display = 'block';
  } else {
    lockTitle.textContent = 'Create your account';
    lockSubtitle.textContent = 'Stored on this device only. Not a real account system.';
    lockSubmitBtn.textContent = 'Create account';
    emailField.style.display = 'flex';
    securityField.style.display = 'flex';
    forgotBtn.style.display = 'none';
  }

  lockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username) {
      lockError.textContent = 'Username is required.';
      return;
    }

    if (password.length < 6) {
      lockError.textContent = 'Password must be at least 6 characters.';
      return;
    }

    if (!accountExists) {
      const email = emailInput.value.trim();
      const securityAnswer = securityInput.value.trim();

      if (!email) {
        lockError.textContent = 'Email is required.';
        return;
      }

      if (!securityAnswer) {
        lockError.textContent = 'Security question answer is required.';
        return;
      }

      createAccount(username, email, password, securityAnswer);
      lockError.textContent = '';
      unlockApp();
    } else {
      if (checkCredentials(username, password)) {
        lockError.textContent = '';
        unlockApp();
      } else {
        lockError.textContent = 'Incorrect username or password.';
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  });
}

function setupForgotPassword() {
  const forgotBtn = document.getElementById('lock-forgot-btn');
  const forgotForm = document.getElementById('forgot-form');
  const loginForm = document.getElementById('lock-form');
  const cancelBtn = document.getElementById('forgot-cancel-btn');
  const forgotAnswerInput = document.getElementById('forgot-answer');
  const forgotNewPasswordInput = document.getElementById('forgot-new-password');
  const forgotError = document.getElementById('forgot-error');

  if (!forgotBtn) return;

  forgotBtn.addEventListener('click', () => {
    loginForm.style.display = 'none';
    forgotForm.style.display = 'flex';
  });

  cancelBtn.addEventListener('click', () => {
    forgotForm.style.display = 'none';
    loginForm.style.display = 'flex';
  });

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const answer = forgotAnswerInput.value.trim();
    const newPassword = forgotNewPasswordInput.value;

    if (!checkSecurityAnswer(answer)) {
      forgotError.textContent = 'Security answer is incorrect.';
      return;
    }

    if (newPassword.length < 6) {
      forgotError.textContent = 'New password must be at least 6 characters.';
      return;
    }

    updatePassword(newPassword);
    forgotError.textContent = '';
    alert('Password updated. You can now log in with your new password.');
    window.location.reload();
  });
}

function setupLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', lockApp);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupLockScreen();
  setupForgotPassword();
  setupLogoutButton();
});