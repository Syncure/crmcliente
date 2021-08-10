import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput) {
        nuevoCliente(input: $input) {
            nombre
            apellido
            }
    }
`;

const OBTENER_CLIENTES_USUARIO = gql`
    query Query {
      obtenerClientesVendedor {
        nombre
        apellido
        empresa
        email
        telefono
      }
    }
`;

const nuevoCliente = () => {

    // Usar el mutation // WAOWWWWWWW
    const [ nuevoCliente ] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } }) {
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO });
            
            // Reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor : [...obtenerClientesVendedor, nuevoCliente]
                }
            })
        }
    });

    // State para el error
    const [ mensaje, setMensaje ] = useState(null);

    const router = useRouter(); 

    const formik = useFormik({
        initialValues : {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: ''
        },
        validationSchema : Yup.object({
            nombre: Yup.string().required('El nombre del cliente es obligatorio'),
            apellido: Yup.string().required('El apellido del cliente es obligatorio'),
            empresa: Yup.string().required('La empresa del cliente es obligatorio'),
            email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
            telefono: Yup.number().typeError('Debe ser un número', NaN)
        }),
        onSubmit : async valores => {
            console.log(valores)

            const { nombre, apellido, email, empresa, telefono } = valores;
            
            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        } 
                    }
                });
                // Redireccionar hacia clientes
                router.push('/');
            } catch (error) {
                setMensaje(error.message);
                setTimeout(() => {
                    setMensaje(null);   
                }, 3000);
            }
        }
    })

    const mostrarMensaje = () => {
        return(
            <div className="flex justify-center">
                <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                    <p>{mensaje}</p>
                </div>
            </div>
            
        )
    }


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo cliente</h1>

            {mensaje && mostrarMensaje()}

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form 
                        className="bg-white shadow-md px-8 pt-7 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
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
                                    value = { formik.values.nombre }
                                    onChange = { formik.handleChange }
                                    onBlur = { formik.handleBlur }
                                />
                        </div>

                        {formik.touched.nombre && formik.errors.nombre && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.nombre}</p>
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
                                    value = { formik.values.apellido }
                                    onChange = { formik.handleChange }
                                    onBlur = { formik.handleBlur }
                                />
                        </div> 

                        {formik.touched.apellido && formik.errors.apellido && (
                                
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.apellido}</p>
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
                                    value = { formik.values.empresa }
                                    onChange = { formik.handleChange }
                                    onBlur = { formik.handleBlur }
                                />
                        </div>   

                        {formik.touched.empresa && formik.errors.empresa && (
                                
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.empresa}</p>
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
                                    value = { formik.values.email }
                                    onChange = { formik.handleChange }
                                    onBlur = { formik.handleBlur }
                                />
                        </div>  

                        {formik.touched.email && formik.errors.email && (
                                
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
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
                                    value = { formik.values.telefono }
                                    onChange = { formik.handleChange }
                                    onBlur = { formik.handleBlur }
                                />
                        </div>

                        {formik.touched.telefono && formik.errors.telefono && (
                                
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.telefono}</p>
                                </div>
                        )}

                        <input 
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" 
                            value="Registrar Cliente"
                        />
                    </form>
                </div>
            </div>
        </Layout> 
    )
}

export default nuevoCliente
