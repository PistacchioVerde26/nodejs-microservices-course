import Link from 'next/link'

export default function Header({ currentUser }) {

    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' }
    ].filter(linkConfig => linkConfig);

    return (
        <nav className="navbar narvbar-light bg-light">
            <Link href="/">
                <a className="navbar-brand">GitTix</a>
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links.map((link, idx) => {
                        return (
                            <li key={idx} className="nav-item">
                                <Link href={link.href}>
                                    <a className="nav-link">{link.label}</a>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </nav>
    )

}