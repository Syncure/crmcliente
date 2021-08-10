import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTO = gql`
    query Query {
        obtenerProductos {
            id
            nombre
            existencia
            precio
        }
    }
`;

const AsignarProducto = () => {

    // State local del componente
    const [ producto, setProducto ] = useState([]);

    const { data, loading, error } = useQuery(OBTENER_PRODUCTO);

    // Context de pedidos
    const productoContext = useContext(PedidoContext);

    const { agregarProductos } = productoContext;

    
    useEffect(() => {
        // TODO: Funcion para pasar al state
        agregarProductos(producto);
    }, [producto]);
    //eslint-disable-next-line
    
    const seleccionarProducto = producto => {
        setProducto(producto);
    }

    // En caso que aun no se llena el dato
    if(loading) return null;
    const { obtenerProductos } = data;

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Selecciona o busca los productos</p>
            <Select 
                className="mt-3"
                options = { obtenerProductos }
                isMulti={true}
                onChange={ opcion => seleccionarProducto(opcion) }
                getOptionLabel = { opciones => `${opciones.nombre} - ${opciones.existencia} disponibles` }
                getOptionValue = { opciones => opciones.id }
                noOptionsMessage = { () => "No hay resultados" }
                placeholder="Busque o seleccione el cliente"
            />
        </>
    )
}

export default AsignarProducto
