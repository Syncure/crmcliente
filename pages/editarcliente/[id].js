import React from 'react';
import Layout from '../../components/Layout';

import Swal from 'sweetalert2';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import { useQuery, gql, useMutation } from '@apollo/client';

import * as Yup from 'yup';

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id:ID!) {
        obtenerCliente(id:$id) {
            id
            nombre
            apellido
            email
            empresa
            telefono
        }
    }
`;

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

const ACTUALIZAR_CLIENTE = gql`
    mutation actualizarCliente($id: ID!, $input: ClienteInput){
        actualizarCliente(id: $id, input: $input) {
            id
            nombre
            apellido
            email
        }
    }
`;

const EditarCliente = () => {
    // Obtener el ID actual
    const router = useRouter(); 
    const { query: { id } } = router;
    

    // Usar gql para obtener cliente
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    // Actualziar cliente
    const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE, {
        update(cache, { data: { actualizarCliente } }) {
          // Actulizar Clientes
          const { obtenerClientesVendedor } = cache.readQuery({
            query: OBTENER_CLIENTES_USUARIO
          });
     
          const clientesActualizados = obtenerClientesVendedor.map(cliente =>
            cliente.id === id ? actualizarCliente : cliente
          );
     
          cache.writeQuery({
            query: OBTENER_CLIENTES_USUARIO,
            data: {
              obtenerClientesVendedor: clientesActualizados
            }
          });
     
          // Actulizar Cliente Actual
          cache.writeQuery({
            query: OBTENER_CLIENTE,
            variables: { id },
            data: {
              obtenerCliente: actualizarCliente
            }
          });
        }
      });
    
    if(loading) return null;

    // Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre del cliente es obligatorio'),
        apellido: Yup.string().required('El apellido del cliente es obligatorio'),
        empresa: Yup.string().required('La empresa del cliente es obligatorio'),
        email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
        telefono: Yup.number('Debe de ser un número').typeError('Debe ser un número', NaN)
    });

    const { obtenerCliente } = data;

    // Modifica el cliente en la base de datos
    const actualizarInfoCliente = async valores => {
        const { nombre, apellido, empresa, email, telefono } = valores;

        try {
            const { data } = await actualizarCliente({
                variables:{
                    id,
                    input: {
                        nombre, 
                        apellido, 
                        empresa, 
                        email, 
                        telefono
                    }
                }
            });
            // console.log(data);

            // Swal
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'El cliente fue actualizado correctamente',
                showConfirmButton: false,
                timer: 1500
            })

            // Redireccionar
            router.push('/');
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar cliente</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerCliente }
                        onSubmit={(valores) => {
                            actualizarInfoCliente(valores);
                        }}
                    >

                    {props => {
                        
                        return (

                            <form 
                                className="bg-white shadow-md px-8 pt-7 pb-8 mb-4"
                                onSubmit={props.handleSubmit}
                            >
                                <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                            Nombre               
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                            id = "nombre"
                                            type = "text"
                                            placeholder="Nombre Cliente"
                                            value = { props.values.nombre }
                                            onChange = { props.handleChange }
                                            onBlur = { props.handleBlur }
                                        />
                                </div>

                                {props.touched.nombre && props.errors.nombre && (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.nombre}</p>
                                            </div>
                                )}
        

                                <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                            Apellido               
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                            id = "apellido"
                                            type = "text"
                                            placeholder="Apellido Cliente"
                                            value = { props.values.apellido }
                                            onChange = { props.handleChange }
                                            onBlur = { props.handleBlur }
                                        />
                                </div> 

                                {props.touched.apellido && props.errors.apellido && (
                                        
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.apellido}</p>
                                        </div>
                                )} 

                                <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                            Empresa               
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                            id = "empresa"
                                            type = "text"
                                            placeholder="Empresa Cliente"
                                            value = { props.values.empresa }
                                            onChange = { props.handleChange }
                                            onBlur = { props.handleBlur }
                                        />
                                </div>   

                                {props.touched.empresa && props.errors.empresa && (
                                        
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                )}

                                <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email               
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                            id = "email"
                                            type = "email"
                                            placeholder="Email Cliente"
                                            value = { props.values.email }
                                            onChange = { props.handleChange }
                                            onBlur = { props.handleBlur }
                                        />
                                </div>  

                                {props.touched.email && props.errors.email && (
                                        
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
                                        </div>
                                )} 

                                <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                            Teléfono               
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                            id = "telefono"
                                            type = "tel"
                                            placeholder="Teléfono Cliente"
                                            value = { props.values.telefono }
                                            onChange = { props.handleChange }
                                            onBlur = { props.handleBlur }
                                        />
                                </div>

                                {props.touched.telefono && props.errors.telefono && (
                                        
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.telefono}</p>
                                        </div>
                                )}

                                <input 
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" 
                                    value="Editar Cliente"
                                />
                            </form>

                            )
                        }}

                    </Formik>

                </div>
            </div>
        </Layout>
    )
}

export default EditarCliente
