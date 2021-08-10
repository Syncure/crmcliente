import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Layout from '../components/Layout';
import Link from 'next/link';

import Pedido from '../components/Pedido';

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
            pedido {
                cantidad
                id
                nombre
            }
            total
            cliente {
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            estado
        }
    }
`;

const Pedidos = () => {


    // Consulta usequery
    const { data, loading, error } = useQuery(OBTENER_PEDIDOS);

    // console.log(error);
    // console.log(loading);
    // console.log(data);

    if(loading) return 'Cargando...';

    const { obtenerPedidosVendedor } = data;

    return (
        <div>
            <Layout >
                <h1 className="text-2xl text-gray-800 font-light"> Pedidos </h1>

                <Link
                    href='/nuevopedido'
                >
                    <a
                        className="bg-blue-800 py-2 px-5 mt-3 inline-block rounded text-white text-sm font-bold uppercase hover:bg-blue-900 w-full lg:w-auto text-center"
                    >Nuevo Pedido
                    </a>
                </Link>

                { obtenerPedidosVendedor.length === 0 ? (
                    <p className="mt-5 text-center text-2xl">
                        No hay pedidos aún
                    </p>
                ):(
                    obtenerPedidosVendedor.map(pedido => (
                        <Pedido 
                            key={pedido.id}
                            pedido={pedido}
                        />
                    ))
                )}
            </Layout>
        </div>
    )
}

export default Pedidos