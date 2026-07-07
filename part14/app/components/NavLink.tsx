import Link from "next/link"

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link href={href} className="hover:text-gray-300">
      {children}
    </Link>
  )
}

export default NavLink
