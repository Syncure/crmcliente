import React, { useState, useEffect, useContext } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';
import Select from 'react-select';
import { useQuery, gql } from '@apollo/client';

const OBTENER_CLIENTES_USUARIO = gql`
    query Query {
      obtenerClientesVendedor {
        id
        nombre
        apellido
        empresa
        email
        telefono
      }
    }
`;

const AsignarCliente = () => {

    const [ cliente, setClientes ] = useState([]);

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext);

    const { agregarCliente } = pedidoContext;

    // Consultar BD
    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

    // console.log(loading);
    // console.log(data);
    // console.log(error);
    
    
    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente]);
    //eslint-disable-next-line

    const seleccionarCliente = clientes => {
        setClientes(clientes)
    }

    if(loading) return null;

    const { obtenerClientesVendedor } = data;

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un Cliente al pedido</p>
            <Select 
                className="mt-3"
                options = { obtenerClientesVendedor }
                onChange={ opcion => seleccionarCliente(opcion) }
                getOptionLabel = { opciones => opciones.nombre }
                getOptionValue = { opciones => opciones.id }
                noOptionsMessage = { () => "No hay resultados" }
                placeholder="Busque o seleccione el cliente"
            />
        </>
    )
}

export default AsignarCliente;
