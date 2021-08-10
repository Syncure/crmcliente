import React, { useEffect, useState, useContext } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';
import ProductoResumen  from './ProductoResumen';


export const ResumenPedido = () => {

    const pedidoContext = useContext(PedidoContext);
    const { productos, actualizarTotal } = pedidoContext;

    
    useEffect(() => {
        actualizarTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productos]);
    
    

    // console.log(productos);

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.- Ajusta las cantidades del producto</p>

            { productos.length > 0 ? (
                <>
                    {
                        productos.map(producto => (
                            <ProductoResumen 
                                key = { producto.id }
                                producto = { producto } 
                            />
                        ))}
                </>
            ): (
                <h1 className="mt-5 text-sm">Aún no hay productos</h1>
            )}
        </>
    )
}
