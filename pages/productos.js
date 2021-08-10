import React from 'react';
import Layout from '../components/Layout';
import { useQuery, gql } from '@apollo/client';
import Productos from '../components/Productos';
import Link from 'next/link';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            existencia
            precio
        }
    }
`;

const productos = () => {

    // Usar QUERY
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);



    if(loading) return 'Cargando...';
   

    const { obtenerProductos } = data;

    console.log(obtenerProductos);
    console.log(loading);
    console.log(error);

    return (
        <div>
            <Layout >
                <h1 className="text-2xl text-gray-800 font-light"> Productos </h1>
                <Link
                    href='/nuevoproducto'
                >
                    <a
                        className="bg-blue-800 py-2 px-5 mt-3 inline-block rounded text-white text-sm font-bold uppercase hover:bg-blue-900 w-full lg:w-auto text-center"
                    >Nuevo Producto
                    </a>
                </Link>

                <div className="overflow-x-scroll">

                    <table className="table-auto shadow-md mt-10 w-full w-lg">
                        <thead className="bg-gray-800">
                            <tr className="text-white">
                                <th className="w-1/5 py-2">Nombre</th>
                                <th className="w-1/5 py-2">Stock</th>
                                <th className="w-1/5 py-2">Precio</th>
                                <th className="w-1/5 py-2">Eliminar</th>
                                <th className="w-1/5 py-2">Editar</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            
                                {data.obtenerProductos.map(productos => (
                                <Productos 
                                    key={productos.id}
                                    productos={productos}
                                />  
                                ))}
                                
                            
                        </tbody>
                    </table>
                </div>                        
            </Layout>
        </div>
    )
}

export default productos