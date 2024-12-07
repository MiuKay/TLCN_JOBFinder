import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalFooter, ModalBody, Button, Spinner } from 'reactstrap';
import {banPostService} from '../../service/userService'
import './modal.css'
function NoteModal(props) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState({
        note: '',
    })
    const handleChange = (event) => {
        const { name, value } = event.target
        setInputValue({
            ...inputValue,
            [name]: value
        })
    }
    const handlePost = () => {
        setIsLoading(true)
        props.handleFunc(props.id,inputValue.note)
        setIsLoading(false)
        props.onHide()
    }
    return (
        <div>
            <Modal isOpen={props.isOpen} className={'booking-modal-container'}
                size="md" centered
            >
                <p className='text-center'>Hãy gửi lời nhắn để nhà tuyển dụng</p>
                <ModalBody>
                    Nhập lời giới thiệu gửi đến nhà tuyển dụng
                    <div>
                    <textarea placeholder='Giải thích lý do cho nhà tuyển dụng' 
                    name='note' className='mt-2' style={{ width: "100%" }} rows='5' onChange={(event) => handleChange(event)}></textarea>
                    </div>
                </ModalBody>
                <ModalFooter style={{ justifyContent: 'space-between' }}>
                    <Button className='me-5' onClick={() => handlePost()}>
                        Hoàn thành
                    </Button>

                    <Button onClick={() => {
                        props.onHide()
                    }}>
                        Hủy
                    </Button>
                </ModalFooter>

                {isLoading &&
                    <Modal isOpen='true' centered contentClassName='closeBorder' >

                        <div style={{
                            position: 'absolute', right: '50%',
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Spinner animation="border"  ></Spinner>
                        </div>

                    </Modal>
                }
            </Modal>
        </div>
    );
}

export default NoteModal;