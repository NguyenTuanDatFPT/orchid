import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/esm/Container';
import { Button, Form, FormGroup, Image, Modal } from 'react-bootstrap'
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import styles from './ManageOrchids.module.css';
import { orchidAPI } from '../services/userService';

export default function ManageOrchids() {
    const [orchids, setOrchids] = useState([])
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { register, handleSubmit,formState: { errors }, control, reset } = useForm();
    const [value, setValue] = useState('');
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
          const response = await orchidAPI.getOrchidsAdmin();
          setOrchids(response.payload?.content || response.content || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      const handleDelete = async (id) => {
        try {
          await orchidAPI.deleteOrchid(id);
          fetchData();
          toast.success("Orchid deleted successfully!", { duration: 3000 });
        } catch (error) {
          console.log(error.message);
          toast.error("Orchid deleted failed!", { duration: 3000 });
        }
      };

      const onSubmit = async (data) => {
        try {
          await orchidAPI.createOrchid({
            name: data.orchidName,
            imageUrl: data.image,
            isNatural: data.isNatural || false,
            // Thêm các trường khác nếu cần
          });
          setShow(false);
          fetchData();
          reset();
          setValue('');
          toast.success("Orchid added successfully!", { duration: 3000 });
        } catch (error) {
          console.log(error.message);
          toast.error("Orchid added fail!", { duration: 3000 });
        }
      };
  return (
    <Container className={styles.manageOrchidsContainer}>
    <Toaster/>
    <h2 className={styles.manageOrchidsTitle}>Quản lý hoa lan</h2>
    <Table className={styles.manageTable}>
      <thead>
        <tr>
          <th>Image</th>
          <th>Orchid name</th>
          <th>Original</th>
          <th><button onClick={handleShow} type='button' className={`btn btn-primary ${styles.manageOrchidsBtn}`}><i className="bi bi-node-plus"> Thêm hoa lan</i></button> </th>
        </tr>
      </thead>
      <tbody>
      {orchids.map((a)=>(
        <tr key={a.id}>
          <td><Image src={a.imageUrl} width={40} rounded />
          </td>
          <td>{a.name}</td>
          <td>{a.isNatural ? 
            <span className="badge text-bg-success">Natural</span>: <span className="badge text-bg-warning">Industry</span>}</td>
        <td>
        <Link to={`/edit/${a.id}`}> 
            <span className={`badge rounded-2 ${styles.manageBtn} ${styles.manageBtnOutline}`}><i className="bi bi-pencil-square"> Sửa </i>
            </span>
            </Link>
    
        <span className={`badge rounded-2 ${styles.manageBtn} ${styles.manageBtnPrimary}`} onClick={()=> { if(window.confirm("Are you sure you want to delete this orchid?"))
               { handleDelete(a.id)}} }>
        <i className="bi bi-trash3"> Xóa </i>
        </span>
        </td>
        </tr>
          ))}
      </tbody>
    </Table>
    <Modal show={show} onHide={handleClose} backdrop="static">
    <Modal.Header closeButton>
      <Modal.Title>New Orchid</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            autoFocus
            {...register("orchidName", { required: true })}
          />
          {errors.orchidName && errors.orchidName.type === "required" && <p className="text-warning">Name is required</p>}
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="exampleForm.ControlTextarea1"
        >
          <Form.Label>Image</Form.Label>
          <Form.Control 
            type="text" 
            {...register("image", { required: true, pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi })}
          />
          {errors.image && errors.image.type === "pattern" && <p className="text-warning">Image must be a valid URL</p>}
        </Form.Group>
        <FormGroup>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Natural"
            {...register("isNatural")}
          />
        </FormGroup>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal.Body>
</Modal>

    </Container>
  )
}
