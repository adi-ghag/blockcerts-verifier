import * as ACTIONS from '../constants/actionTypes';
import domain from '../domain';
import updateCertificateDefinition from './updateCertificateDefinition';
import type { ThunkAction } from 'redux-thunk';
import type { BlockcertsVerifierState } from '../store/getInitialState';
import type { Action } from './action';
import type { Dispatch } from 'redux';
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker for version 5.x
// Point to the worker file from the installed pdfjs-dist package
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function uploadCertificateDefinition (file: File): ThunkAction<Promise<void>, BlockcertsVerifierState, void, Action<void>> {
  return async function (dispatch: Dispatch): Promise<void> {
    dispatch({
      type: ACTIONS.UPLOAD_CERTIFICATE_DEFINITION
    });
  // Handler for pdf certificates
    if (file.type === "application/pdf"){
      const fileURL = URL.createObjectURL( file )
      const loadingTask = pdfjs.getDocument(fileURL);
      loadingTask.promise.then(async function(pdf) {
        const pdfAttachment = await pdf.getAttachments()
        const jsonCert = ArrayToJSON(pdfAttachment.bloxbergJSONCertificate.content)
        return dispatch(updateCertificateDefinition(jsonCert) as any);
      }) // Promise
      function ArrayToJSON (binArray: Uint8Array)
      {
        let str = "";
        for (let i = 0; i < binArray.length; i++) {
          str += String.fromCharCode(parseInt(binArray[i] as any));
        }
        return JSON.parse(str)
      } // ArrayToJson
    } // If PDF
    else {
    const definition = await domain.certificates.read(file);
    dispatch(updateCertificateDefinition(JSON.parse(definition)) as any);
    }
  };
}
