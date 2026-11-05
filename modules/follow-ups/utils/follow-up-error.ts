export function formatFollowUpErrorMessage(err: any, fallback: string): string {
  const rawMsg = err?.response?.data?.message || err?.message;

  if (Array.isArray(rawMsg)) {
    const text = rawMsg.join(' ');
    if (text.includes('decision') || text.includes('status')) {
      return 'Por favor selecciona una decisión válida para el hito (Aprobar o Requerir Ajustes).';
    }
    if (text.includes('reason')) {
      return 'Por favor selecciona un motivo válido para la solicitud de retorno.';
    }
    if (text.includes('evidence') || text.includes('mediaUrl') || text.includes('photoUrl')) {
      return 'Debes adjuntar al menos una fotografía válida como evidencia del hito.';
    }
    if (text.includes('adaptationNotes') || text.includes('reviewNotes') || text.includes('explanation')) {
      return 'Por favor ingresa un reporte o explicación descriptiva en el formulario.';
    }
    if (text.includes('should not exist') || text.includes('must be one of') || text.includes('is not valid')) {
      return 'Los datos ingresados no tienen el formato esperado. Por favor verifica el formulario.';
    }
    return rawMsg[0] || fallback;
  }

  if (typeof rawMsg === 'string') {
    if (rawMsg.includes('should not exist') || rawMsg.includes('must be one of') || rawMsg.includes('is not valid')) {
      return 'Los datos ingresados no tienen el formato esperado. Por favor verifica el formulario.';
    }
    return rawMsg;
  }

  return fallback;
}
