import React from 'react';
import Layout from '../../components/Layout';

import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';

const OBTENER_PRODUCTOS = gql`
    query obtenerProductoPorId($id: ID!) {
        obtenerProductoPorId(id: $id) {
        nombre
        id
        existencia
        precio
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            nombre
            existencia
            precio
        }
    }`
  ;

const EditarProducto = () => {

    const router = useRouter();
    const { query: { id } } = router;

    // Consultar producto por ID
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS,{
        variables: {
            id
        }
    });

    // Editar producto
    const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO)
    if(loading) return null;
    // Validar Formulario
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('Nombre del producto obligatorio'),
        existencia: Yup.number().typeError('Debe ser un número', NaN).required('Stock del producto obligatorio'),
        precio: Yup.number().typeError('Debe ser un número', NaN).required('Precio del producto obligatorio'),
    })

    const { obtenerProductoPorId } = data;

    const editarProducto = async valores => {
        const { nombre, existencia, precio } = valores;

        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
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
            router.push('/productos')
        } catch (error) {
            console.log(error.message);
        }
        
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-lg">
                        <Formik
                            validationSchema={ schemaValidacion }
                            enableReinitialize
                            initialValues={ obtenerProductoPorId }
                            onSubmit = {valores => editarProducto(valores)}
                        >
                            {props =>{
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
                                                        placeholder="Nombre Producto"
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
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">
                                                        Stock               
                                                    </label>
                                                    <input 
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                                        id = "existencia"
                                                        type = "number"
                                                        placeholder="Stock Producto"
                                                        value = { props.values.existencia }
                                                        onChange = { props.handleChange }
                                                        onBlur = { props.handleBlur }
                                                    />
                                            </div> 

                                            {props.touched.existencia && props.errors.existencia && (
                                                    
                                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                        <p className="font-bold">Error</p>
                                                        <p>{props.errors.existencia}</p>
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
                                                        value = { props.values.precio }
                                                        onChange = { props.handleChange }
                                                        onBlur = { props.handleBlur }
                                                    />
                                            </div>   

                                            {props.touched.precio && props.errors.precio && (
                                                    
                                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                        <p className="font-bold">Error</p>
                                                        <p>{props.errors.precio}</p>
                                                    </div>
                                            )} 
                                            <input 
                                                type="submit"
                                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" 
                                                value="Editar Producto"
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

export default EditarProducto
