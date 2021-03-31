import { st } from '../firebase-config'
import { addFileTypeExtention } from '../UtilityFunctions/UtilityFunctions'

const useStorage = () => {

    const firebaseUpload = async (file, name) => {
        if(file == null) return null;
        let fileUrl;

        try{

            const fileExtended = addFileTypeExtention(file, name)
    
            let fileStorageRef = st.ref(fileExtended.name)
            await fileStorageRef.put(fileExtended)
            fileUrl = await fileStorageRef.getDownloadURL()

        }catch(err){
            console.log(err)
        }
        return fileUrl
    }
    
    return {  firebaseUpload  }
}

export default useStorage
