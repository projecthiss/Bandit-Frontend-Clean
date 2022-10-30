export const hasSession = () => window.sessionStorage.getItem('jwt') !== null ? true : false
export const hasRole = (role) => window.sessionStorage.getItem('userRole') === role ? true : false