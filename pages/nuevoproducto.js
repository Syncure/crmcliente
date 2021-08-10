import React, { useState } from 'react';
import Layout from '../components/Layout';

import { useRouter } from 'next/router';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useMutation, gql } from '@apollo/client';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;

const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos {
            nombre
            existencia
            precio
        }
    }
`;

const NuevoProducto = () => {

    // Use state
    const [ mensaje, setMensaje ] = useState(null)

    // Router
    const router = useRouter()

    const [ nuevoProducto ] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {data: { nuevoProducto }}) {
            // Obtener el objeto de cache que deseamos actualizar
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

            // Reescribimos el cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos : [...obtenerProductos, nuevoProducto]
                }
            })
        }
    });

    // Usar formik
    const formik = useFormik({
        initialValues : {
            nombre: '',
            existencia: '',
            precio: ''
        },
        validationSchema : Yup.object({
            nombre: Yup.string().required('Nombre del producto obligatorio'),
            existencia: Yup.number().typeError('Debe ser un número', NaN).required('Stock del producto obligatorio'),
            precio: Yup.number().typeError('Debe ser un número', NaN).required('Precio del producto obligatorio'),
        }),onSubmit : async valores => {
            console.log(valores);

            const { nombre, existencia, precio } = valores;

            try {
                const { data } = await nuevoProducto({
                    variables:{
                        input: {
                            nombre, 
                            existencia, 
                            precio
                        }
                    }
                })
                // console.log(data.nuevoProducto);
                router.push('/productos')
            } catch (error) {
                setMensaje(error.message);
                
                setTimeout(() => {
                    setMensaje(null)
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
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Producto</h1>

            { mensaje && mostrarMensaje() }

            <div className="flex justify-center mt-7">
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
                                    placeholder="Nombre Producto"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                    Stock               
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    id = "existencia"
                                    type = "number"
                                    placeholder="Stock Producto"
                                    value = { formik.values.existencia }
                                    onChange = { formik.handleChange }
                                    onBlur = { formik.handleBlur }
                                />
                        </div>

                        {formik.touched.existencia && formik.errors.existencia && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.existencia}</p>
                                    </div>
                        )}

                        <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                    Precio               
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    id = "precio"
                                    type = "number"
                                    placeholder="Precio Producto"
                                    value = { formik.values.precio }
                                    onChange = { formik.handleChange }
                                    onBlur = { formik.handleBlur }
                                />
                        </div>

                        {formik.touched.precio && formik.errors.precio && (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{formik.errors.precio}</p>
                                    </div>
                        )}

                        <input 
                            type="submit" 
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            value="Guardar Producto"
                        />

                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NuevoProducto
