import logoWhite from '@/assets/images/LogoWhite.png';
import { useRouter } from "next/navigation";
import "./header.scss";
import { authStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import ThemeToggle from '@/modules/themeToggle/ThemeToggle';

interface Link {
    id: number;
    name: string;
    href: string;
}   

interface HeaderProps {
    links: Link[];
}

function Header({links}: HeaderProps) {
    const router = useRouter();
    const { checkRoleSession } = authStore;

    useEffect(() => {
        checkRoleSession();
    }, []);

    const LogoutHandler = async () => {
        try {
            await authStore.logout();
            router.push('/login');  
            console.log("logout successful");
        } catch (error) {
            console.error("logout error:", error);
        }
    };

    return (
        <header className="header">
            <img src={logoWhite.src} alt="fastdoor" className='header-logo' />
            <ul className="header-list">
               {/* <li> тестовый 🎨 <ThemeToggle/></li> */}
                {links.map((link) => (
                    <li 
                        className='header-list-link' 
                        onClick={() => router.push(link.href)} 
                        key={link.id}
                    >
                        {link.name}
                    </li>
                ))}
                <li className="header-list-link" onClick={LogoutHandler}>Выйти</li>         
            </ul>
        </header>
    );
}

export default observer(Header);