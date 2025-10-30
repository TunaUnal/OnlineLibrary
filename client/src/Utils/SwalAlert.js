export const setText = (type) => {
  switch (type) {
    case 'delete':
      return {
        text: 'Dosya silinecek. Bu dosyayı yöneticiler dahil kimse bir daha göremeyecek.',
        confirmBtnText: 'Evet, SİL',
        successTitle: 'Silindi',
        successText: 'Dosya başarıyla silindi.',
        setStatus: 'deleted',
      };
    case 'hide':
      return {
        text: 'Dosya gizlenecek. Bu dosyayı sadece sen ve moderatörler görebilir. İstediğin zaman yeniden yayınlayabilirsin.',
        confirmBtnText: 'Evet, GİZLE',
        successTitle: 'Gizlendi',
        successText: 'Dosya başarıyla gizlendi.',
        setStatus: 'hide',
      };
      break;
    case 'reApprove':
      return {
        text: 'Dosya yeniden yayınlanacak.',
        confirmBtnText: 'Evet, Yeniden Yayınla',
        successTitle: 'Yayınlandı',
        successText: 'Dosya başarıyla yeniden yayınlandı.',
        setStatus: 'approved',
      };
      break;
    case 'sendToConfirm':
      return {
        text: 'Dosya yeniden onaya gönderilecek. Onaylıyor musun?',
        confirmBtnText: 'Evet, GÖNDER',
        successTitle: 'Gönderildi',
        successText: 'Dosya başarıyla yeniden onaya gönderildi.',
        setStatus: 'pending',
      };
      break;
    case 'reject':
      return {
        text: 'Dosya reddedilecek. Eğer kullanıcı silmez ise bu dosyayı yeniden kabul edebilirsin.',
        confirmBtnText: 'Evet, REDDET',
        successTitle: 'Reddedildi',
        successText: 'Dosya başarıyla reddedildi.',
        setStatus: 'rejected',
      };
      break;
    case 'confirm':
      return {
        text: 'Dosya onaylanacak ve tüm kullanıcılar tarafından görünür olacak.Dosyayı tekrardan beklemeye alabileceksin.',
        confirmBtnText: 'Evet, ONAYLA',
        successTitle: 'Onaylandı',
        successText: 'Dosya başarıyla yayınlandı.',
        setStatus: 'approved',
      };
      break;
    default:
      break;
  }
};
