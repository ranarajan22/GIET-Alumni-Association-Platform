const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("profilePhoto");
};

export const handleLogout = (navigate) => {
  clearAuthStorage();
  if (navigate) {
    navigate("/login", { replace: true });
  } else {
    window.location.href = "/login";
  }
};

export default handleLogout;
