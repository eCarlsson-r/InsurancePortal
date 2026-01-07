import { Link } from '@inertiajs/react';
import MetisMenu from 'metismenujs';
import { PropsWithChildren, useEffect, useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { menuItems } from '../data/menu';

export default function TemplateLayout({ children }: PropsWithChildren) {
    const mainWrapperRef = useRef<HTMLDivElement>(null); 
    const sideMenuRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        // Initialize MetisMenu
        let mm: any;
        if (sideMenuRef.current) {
            mm = new (MetisMenu as any)(sideMenuRef.current);
        }

        // Sidebar toggle logic
        const toggleBtn = document.querySelector('.nav-control');
        const handleToggle = () => {
            mainWrapperRef.current?.classList.toggle('menu-toggle');
        };

        toggleBtn?.addEventListener('click', handleToggle);

        return () => {
            toggleBtn?.removeEventListener('click', handleToggle);
            if (mm && typeof mm.dispose === 'function') {
                mm.dispose();
            }
        };
    }, []);

    return (
        <div id="main-wrapper" ref={mainWrapperRef} className="show" data-sidebar-style="full" data-layout="horizontal">
            {/* Nav Header */}
            <div className="nav-header">
                <Link href="/" className="brand-logo">
                    <img className="logo-abbr" src="/images/logo.png" alt="" />
                    <img className="brand-title" src="/images/logo-text.png" alt="" />
                </Link>

                <div className="nav-control">
                    <div className="hamburger">
                        <span className="line"></span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="header">
                <div className="header-content">
                    <nav className="navbar navbar-expand">
                        <div className="collapse navbar-collapse justify-content-between">
                            <div className="header-left">
                                <div className="search_bar dropdown">
                                    <span className="search_icon p-3 c-pointer" data-toggle="dropdown">
                                        <i className="mdi mdi-magnify"></i>
                                    </span>
                                    <div className="dropdown-menu p-0 m-0">
                                        <form>
                                            <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <ul className="navbar-nav header-right">
                                <li className="nav-item dropdown header-profile">
                                    <a className="nav-link" href="#" role="button" data-toggle="dropdown">
                                        <i className="mdi mdi-account"></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <Link href="/profile" className="dropdown-item">
                                            <i className="icon-user"></i>
                                            <span className="ml-2">Profile </span>
                                        </Link>
                                        <Link href="/logout" method="post" as="button" className="dropdown-item">
                                            <i className="icon-key"></i>
                                            <span className="ml-2">Logout </span>
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Sidebar */}
            <div className="deznav">
                <PerfectScrollbar className="deznav-scroll">
                    <ul className="metismenu" id="menu" ref={sideMenuRef}>
{menuItems.map((item, index) => {
                            if (item.type === 'label') {
                                return (
                                    <li key={index} className={`nav-label ${index === 0 ? 'first' : ''}`}>
                                        {item.title}
                                    </li>
                                );
                            }

                            const hasChildren = item.children && item.children.length > 0;

                            return (
                                <li key={index}>
                                    <Link
                                        className={hasChildren ? 'has-arrow' : ''}
                                        href={item.href || '#'}
                                        aria-expanded="false"
                                    >
                                        {item.icon && <i className={item.icon}></i>}
                                        <span className="nav-text">{item.title}</span>
                                    </Link>
                                    
                                    {hasChildren && (
                                        <ul aria-expanded="false">
                                            {item.children?.map((child, childIndex) => (
                                                <li key={childIndex}>
                                                    <Link href={child.href || '#'}>{child.title}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </PerfectScrollbar>
            </div>

            {/* Content Body */}
            <div className="content-body" style={{ minHeight: '100vh' }}>
                <div className="container-fluid">
                    {children}
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <div className="copyright">
                    <p>Copyright © Designed &amp; Developed by <a href="http://dexignzone.com/" target="_blank">DexignZone</a> 2020</p>
                </div>
            </div>
        </div>
    );
}
