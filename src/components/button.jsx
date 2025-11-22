import { Link } from 'react-router-dom';
import "./style/button.css"

export default function Button({ as: Component = "button", to, className, state, href, children, type, disabled, onClick, ...props}){
    if (Component === Link) {
        return (
            <Link to={to} {...props}>
                {children}
            </Link>
        );
    }

    if (Component === "a") {
        return (
            <a href={href} {...props}>
                {children}
            </a>
        );
    }
    
    return(
        <Link to={to}>
            <button to={to} className={className} {...props} type={type} onClick={onClick}>{children}</button>
        </Link>
    )
}