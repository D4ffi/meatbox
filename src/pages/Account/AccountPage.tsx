import {TextBoxComponent} from "../../components/common/TextBoxComponent.tsx";

export const AccountPage = ()=>  {
    return (
        <div>
            <h1>Cuentas</h1>

            <h2>Agregar un Usuario</h2>

            <TextBoxComponent
                hint="Nombre de usuario"
                value=""
                placeholder="Ingresa el nombre de usuario del nuevo usuario"
                onChange={(value) => { console.log("Username changed:", value); }}/>

            <TextBoxComponent
                hint="correo electrónico"
                value=""
                placeholder="Ingresa correo electrónico del nuevo usuario"
                onChange={(value) => { console.log("Username changed:", value); }}/>

            <TextBoxComponent
                hint="Contraseña"
                value=""
                placeholder="Ingresa contraseña del nuevo usuario"
                onChange={(value) => { console.log("Username changed:", value); }}/>

        </div>
    )
}