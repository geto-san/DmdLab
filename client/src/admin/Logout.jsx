const Logout = ({ onLogout }) => {
  return (
    <button onClick={() => { if (onLogout) onLogout(); else { localStorage.removeItem('admin_token'); window.location.href = '/admin'; } }} className="px-3 py-1 bg-red-600 text-white rounded">Log Out</button>
  );
};

export default Logout;