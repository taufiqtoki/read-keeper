import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-serif text-2xl text-primary">MyBook</Link>
          <div className="space-x-4">
            <Link 
              to="/" 
              className={`${location.pathname === '/' ? 'text-primary' : 'text-foreground'} hover:text-primary transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/admin" 
              className={`${location.pathname === '/admin' ? 'text-primary' : 'text-foreground'} hover:text-primary transition-colors`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};