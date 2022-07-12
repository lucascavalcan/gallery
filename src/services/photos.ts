import {Photo} from "../types/Photo";
import {storage} from "../libs/firebase";
import {ref, listAll, getDownloadURL, uploadBytes, UploadMetadata, deleteObject} from "firebase/storage";
import {v4 as createId} from "uuid";

// Função que vai pegar todas as fotos que estiverem no storage no firebase
export const getAll = async () => {
    let list: Photo[] = []

    const imagesFolder = ref(storage, "images");
    const photoList = await listAll(imagesFolder);

    for (let i in photoList.items) {

        //gerar a url
        let photoUrl = await getDownloadURL(photoList.items[i])

        list.push({
            name: photoList.items[i].name,
            url: photoUrl
        })
    }

    return list;
}

//Função que envia as fotos para o firebase
export const insert = async (file: File) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {  //verificar se o arquivo que foi enviado é realmente uma imagem

        let randomName = createId();
        let newFile = ref(storage, `images/${randomName}`)

        let upload = await uploadBytes(newFile, file);  //primeiro paranetro (referencia do arquivo), segundo paramentro (dados do arquivo)
        let photoUrl = await getDownloadURL(upload.ref);  //gerando url

        return {
            name: upload.ref.name,
            url: photoUrl
        } as Photo;

    } else { // se não for uma imagem, vai retornar um erro
        return new Error("Tipo de arquivo não aceito.");
    }
}

//Função de deletar
export const deletePhoto = async (name: string) => {
    let photoRef = ref(storage, `images/${name}`)
    await deleteObject(photoRef)
}