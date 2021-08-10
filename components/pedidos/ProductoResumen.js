import React, { useContext, useState, useEffect } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';

const ProductoResumen = ({producto}) => {

    const pedidoContext = useContext(PedidoContext);
    const { cantidadProductos, actualizarTotal } = pedidoContext;

    const [ cantidad, setCantidad ] = useState(0);

    
    useEffect(() => {
        actualizarCantidad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cantidad]);
    

    const actualizarCantidad = () => {
        const nuevoProducto = {...producto, cantidad: Number(cantidad)}
        cantidadProductos(nuevoProducto);
    }

    const { nombre, precio } = producto;    

    return (
        <div className="flex justify-between md:items-center mt-5">
            <div className="md:w-2/4 mb-2 md:mb-0">
                <p className="text-sm">{ nombre }</p>
                <p>$ { precio }</p>
            </div>

            <input 
                type="number"
                placeholder="Cantidad"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring md:ml-4"
                onChange={ e => setCantidad(e.target.value)}
                value={ cantidad }
            />
        </div>
    )
}

export default ProductoResumen

