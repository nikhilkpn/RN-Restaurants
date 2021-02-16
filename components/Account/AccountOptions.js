import React,{useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem , Icon} from 'react-native-elements'
import {map} from 'lodash'
import Modal from '../Modal'
import ChangeDisplayNameForm from './ChangeDisplayNameForm'
import ChangeEmailForm from './ChangeEmailForm'
import ChangePasswordForm from './ChangePasswordForm'

const AccountOptions = (props) => {
    const {userInfo, toastRef,setReloadUserInfo} = props
    const [showModal, setShowModal] = useState(true)
    const [renderComponent, setRenderComponent] = useState(null)
    const generateOptions = (selectedComponent) => {
        return [
            {
                title:"change last name",
                iconType:"material-community",
                iconNameLeft:"account-circle",
                iconColorLeft:'#ccc',
                iconNameRight:"chevron-right",
                iconColorRight:'#ccc',
                onPress:()=>selectedComponent('displayName')
            },
            {
                title:"change email",
                iconType:"material-community",
                iconNameLeft:"at",
                iconColorLeft:'#ccc',
                iconNameRight:"chevron-right",
                iconColorRight:'#ccc',
                onPress:()=>selectedComponent('email')
            },
            {
                title:"change password",
                iconNameLeft:"lock-reset",
                iconColorLeft:'#ccc',
                iconType:"material-community",
                iconNameRight:"chevron-right",
                iconColorRight:'#ccc',
                onPress:()=>selectedComponent('password')
            }
        ]
    }
    const selectedComponent = (key)=>{
        switch (key) {
            case 'displayName':
                setRenderComponent(
                    <ChangeDisplayNameForm 
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                        />)
                        setShowModal(true)
                        break;
                        case 'email':
                            setRenderComponent(
                                <ChangeEmailForm 
                                email={userInfo.email}
                                setShowModal={setShowModal}
                                toastRef={toastRef}
                                setReloadUserInfo={setReloadUserInfo}
                                />
                                )
                                setShowModal(true)
                                break;
                        case 'password':
                            setRenderComponent(
                                <ChangePasswordForm 
                                setShowModal={setShowModal}
                                toastRef={toastRef}
                                setReloadUserInfo={setReloadUserInfo}
                                
                    />
                )
                setShowModal(true)
                break;
        
            default:
                setRenderComponent(null);
                setShowModal(false)
                break;
        }
    }
    const menuOptions = generateOptions(selectedComponent)
    return (
        <View>
            {map(menuOptions,(menu,index)=>(
                <ListItem key={index} bottomDivider onPress={menu.onPress}>
                    <Icon name={menu.iconNameLeft} type={menu.iconType} color={menu.iconColorLeft} />
                    <ListItem.Content>
                    <ListItem.Title>{menu.title}</ListItem.Title>
                    {/* <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle> */}
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ))}
            {renderComponent && 
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                {renderComponent}
            </Modal>
            }
        </View>
    )

}

export default AccountOptions

const styles = StyleSheet.create({})
