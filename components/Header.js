import React from 'react';
import { useRouter } from 'next/router';

import { gql, useQuery } from '@apollo/client';

const OBTENER_USUARIO = gql`
    query Query {
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;

const Header = () => {
    // Router
    const router = useRouter();

    // Query
    const {data, loading, error } = useQuery(OBTENER_USUARIO);

    // console.log(data);
    // console.log(loading);
    // console.log(error);

    // Proteger que no accedamos a data antes de teber resultados
    if(loading) return null;

    // Si no hay información
    if(!data){
        return router.push('/login');
    }

    const { nombre, apellido } = data.obtenerUsuario;

    

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }

    return (
        <div className="sm:flex sm:justify-between mb-6">
            <h1 className="mr-2 mb-5 lg:mb-0">Hola {nombre} {apellido}</h1>

            <button 
            onClick={() => cerrarSesion()}
                type="button"
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md hover:bg-blue-900"
            >
                Cerrar Sesión
            </button>
        </div>
    )
}

export default Header

