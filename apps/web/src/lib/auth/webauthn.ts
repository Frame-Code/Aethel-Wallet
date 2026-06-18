import { GenericResponse } from "@nexs-wallet/shared-types";
import { base64ToBuffer, bufferToBase64, isBiometricAvailable } from "./webauthn.utils";

export interface BiometricRegistration {
    credentialId: string,
    publicKey: string
}

//Function para registrar la biometria del usuario (al crear o importar su wallet)
export async function registerBiometric(userId: string, userEmail: string): Promise<GenericResponse<BiometricRegistration>> {
    const availableBiometric = await isBiometricAvailable();
    if(!availableBiometric) {
        return {
            success: false,
            message: 'Autenticacion con un dispositivo biometrico no esta disponible'
        };
    }

    let credential: PublicKeyCredential;
    try {
        credential = (
            await navigator.credentials.create({
                publicKey: {
                    // C1: usar Web Crypto API (window.crypto) en lugar de modulo Node "crypto"
                    challenge: window.crypto.getRandomValues(new Uint8Array(32)),
                    //rp define quien solicita la credencial
                    rp: {
                        name: 'nexs wallet',
                        id: window.location.hostname
                    },
                    user: {
                        id: new TextEncoder().encode(userId),
                        name: userEmail,
                        displayName: 'nexs wallet'
                    },

                    pubKeyCredParams: [
                        {
                            type: 'public-key',
                            alg: -7
                        },
                        {
                            type: 'public-key',
                            alg: -257
                        }
                    ],
                    authenticatorSelection: {
                        authenticatorAttachment: 'platform', //solo biometria nativa del dispositivo
                        userVerification: 'required',
                        residentKey: 'preferred'
                    },
                    timeout: 60_000
                }
            })
        ) as PublicKeyCredential;
    } catch (err) {
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
            return {
                success: false,
                message: 'Registro biometrico cancelado por el usuario'
            };
        }
        throw err;
    }

    const response = credential.response as AuthenticatorAttestationResponse;

    //Validar si la el autenticador retorna una llave publica
    const rawPublicKey = response.getPublicKey();
    if (!rawPublicKey) {
        return {
            success: false,
            message: 'El autenticador no retorno la clave publica — registro fallido'
        };
    }

    
    const credentialId = bufferToBase64(credential.rawId);
    const publicKey = bufferToBase64(rawPublicKey);

    localStorage.setItem('biometric_cred_id', credentialId);
    localStorage.setItem('biometric_pub_key', publicKey);

    return {
        success: true,
        data: {
            credentialId: credentialId,
            publicKey: publicKey
        }
    }
}

export async function verifyBiometric(): Promise<boolean> {
    const availableBiometric = await isBiometricAvailable();
    const credentialIdStored = localStorage.getItem('biometric_cred_id');

    if(!availableBiometric || !credentialIdStored) 
        return false;

    try{
        //Intenta obtener la credencial guardada al registrarla
        await navigator.credentials.get({
            publicKey: {
                challenge: window.crypto.getRandomValues(new Uint8Array(32)),
                allowCredentials: [
                    {
                        type: 'public-key',
                        id: base64ToBuffer(credentialIdStored)
                    }
                ],
                userVerification: 'required',
                timeout: 60_000,
            },
            
        });

        return true;
    } catch(err) {
        //El usuario cancelo o no se reconocio la biometria
        if(err instanceof DOMException && err.name == 'NotAllowedError') {
            return false;
        }

        throw err;
    }
}