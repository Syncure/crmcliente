import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {

    // Routing de next
    const router = useRouter();

    return (
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <div>
                <p className="text-white font-black text-2xl">CRM Clientes</p>
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/" ? "bg-blue-800 p-3" : "p-3"}>
                    <Link href="/">
                        <a className="text-white block">
                            Clientes
                        </a> 
                    </Link>
                </li>
                <li className={router.pathname === "/pedidos" ? "bg-blue-800 p-3" : "p-3"}>
                    <Link href="/pedidos">
                        <a className="text-white block">
                            Pedidos
                        </a>  
                    </Link>
                </li>
                <li className={router.pathname === "/productos" ? "bg-blue-800 p-3" : "p-3"}>
                    <Link href="/productos">
                        <a className="text-white block">
                            Productos
                        </a> 
                    </Link>
                </li>
            </nav>

            <div className="sm:mt-10">
                <p className="text-white font-black text-2xl">Otras opciones</p>
            </div>

            <nav className="mt-5 list-none">

            

                <li className={router.pathname === "/mejoresvendedores" ? "bg-blue-800 p-3" : "p-3"}>
                    <Link href="/mejoresvendedores">
                        <a className="text-white block">
                            Mejores Vendedores
                        </a>  
                    </Link>
                </li>
                <li className={router.pathname === "/mejoresclientes" ? "bg-blue-800 p-3" : "p-3"}>
                    <Link href="/mejoresclientes">
                        <a className="text-white block">
                            Mejores Clientes
                        </a> 
                    </Link>
                </li>        
            </nav>
        </aside>
    )
}
<h2>Sidebar</h2>
export default Sidebar

