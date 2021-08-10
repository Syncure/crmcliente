import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProducto from '../components/pedidos/AsignarProducto';
import { ResumenPedido } from '../components/pedidos/ResumenPedido';
import Total from '../components/pedidos/Total';

// Context de pedidos
import PedidoContext from '../context/pedidos/PedidoContext';

import { useMutation, gql } from '@apollo/client';

import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput){
        nuevoPedido(input: $input) {
            id
        }
    }
`; 

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

const NuevoPedido = () => {
    const router = useRouter();
    const [ mensaje, setMensaje ] = useState(null);

    // Utilizar context y extraer sus funciones y valores
    const pedidoContext = useContext(PedidoContext);
    const { cliente, productos, total } = pedidoContext;

    // Mutation
    const [ nuevoPedido ] = useMutation(NUEVO_PEDIDO,{
        update(cache, {data: { nuevoPedido }}) {
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerPedidosVendedor } = cache.readQuery({ query: OBTENER_PEDIDOS });

            // Reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor : [...obtenerPedidosVendedor, nuevoPedido]
                }
            })
        }
    });
    
    // Validar pedidos
    const validarPedidos = () => {
        return !productos.every( producto => producto.cantidad > 0 ) || total === 0 || cliente.length === 0 ? " opacity-50 cursor-not-allowed": "";
        
    }

    const crearNuevoPedido = async () => {

        const { id } = cliente;

        // Remover lo no deseado de productos
        const pedido = productos.map(({existencia, __typename, ...producto}) => producto)
        // console.log(pedido);

        try {
            const { data } = await nuevoPedido({
                variables:{
                    input: {
                        cliente: id,
                        total,
                        pedido
                    }
                }
            });
            // console.log(data);

            // Redirect
            router.push('/pedidos');

            // Mostrar una alerta
            Swal.fire(
                'Correcto',
                '¡El pedido se registró corectamente!',
                'success'
            )
        } catch (error) {
            setMensaje(error.message); 

            setTimeout(() => {
                setMensaje(null)    
            }, 2000);
        } 
    }

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }
    
    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Crear nuevo pedido</h1>

            {mensaje && mostrarMensaje()}
            
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AsignarCliente />
                    <AsignarProducto />
                    <ResumenPedido />
                    <Total />

                    <button
                        type="button"
                        className={` bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg.gray-900 ${validarPedidos()}`}
                        onClick={() => crearNuevoPedido()}
                    >
                        Registrar pedidos
                    </button>
                </div>
            </div>
            
            
        </Layout>
    )
}

export default NuevoPedido
