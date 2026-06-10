import { useAuth } from './context/AuthContext.jsx'

// Diccionario de traducciones. Clave -> { ES, EN }
export const translations = {
  ES: {
    // Común
    'common.user': 'Usuario',
    'common.loading': 'Cargando…',
    'common.loadingVehicles': 'Cargando vehículos…',
    'common.back': 'Regresar',
    'common.next': 'Siguiente',
    'common.cancel': 'Cancelar',
    'common.accept': 'Aceptar',
    'common.delete': 'Eliminar',
    'common.errorTitle': 'Ocurrió un error',
    'common.brand': 'Marca',
    'common.model': 'Modelo',
    'common.perDay': 'día',
    'common.day': 'día',
    'common.days': 'días',
    'common.vehicleNotFound': 'Vehículo no encontrado.',

    // Auth / login-registro
    'auth.loginRegister': 'Iniciar sesión/Registrarse',
    'auth.tagline': 'Conecta con maquinaria y vehículos',
    'auth.login': 'Iniciar sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.loggingIn': 'Ingresando…',
    'auth.fullName': 'Nombre completo',
    'auth.phone': 'Teléfono',
    'auth.selectRole': 'Seleccione un rol:',
    'auth.creating': 'Creando…',
    'auth.createAccount': 'Crear Cuenta',
    'auth.showPassword': 'Mostrar contraseña',
    'auth.hidePassword': 'Ocultar contraseña',

    // Roles
    'role.arrendador': 'Arrendador',
    'role.cliente': 'Cliente',

    // Buscador
    'search.placeholderVehicle': 'Buscar por vehículo, marca, modelo',
    'search.placeholderLocation': 'Ubicación o ciudad',

    // Home
    'home.goCatalog': 'Ir al catálogo',
    'home.title': 'Bahn | Renta de vehiculos',
    'home.subtitle': '¡Autos, motocicletas y maquinaria en un solo lugar!',
    'home.searchPlaceholder': '¿Qué vehículo o maquinaria necesitas?',
    'home.featured': 'Publicaciones destacadas',
    'home.exploreCatalog': 'Explorar catálogo',

    // Categorías (etiqueta visible; el valor interno queda en español)
    'cat.Autos': 'Autos',
    'cat.Motocicletas': 'Motocicletas',
    'cat.Maquinaria Pesada': 'Maquinaria Pesada',
    'cat.Agrícola': 'Agrícola',

    // Catálogo
    'catalog.results': 'Resultados',
    'catalog.noResults': 'No se encontraron vehículos con esos filtros.',

    // Filtros
    'filter.title': 'Filtro',
    'filter.categories': 'Categorías',
    'filter.brand': 'Marca',
    'filter.model': 'Modelo',
    'filter.priceRange': 'Rango de precio',
    'filter.address': 'Dirección',
    'filter.addressPlaceholder': 'Municipio, Departamento',
    'filter.condition': 'Condición',
    'filter.any': 'Cualquiera',

    // Pesos / categorías de peso
    'weight.Liviano': 'Liviano',
    'weight.Mediano': 'Mediano',
    'weight.Pesado': 'Pesado',

    // Condiciones
    'cond.Excelente': 'Excelente',
    'cond.Buena': 'Buena',
    'cond.Regular': 'Regular',

    // Tarjeta de vehículo
    'fav.add': 'Agregar a favoritos',
    'fav.remove': 'Quitar de favoritos',

    // Detalle
    'detail.specs': 'Especificaciones:',
    'detail.year': 'Año',
    'detail.km': 'KM',
    'detail.visualCondition': 'Condición visual',
    'detail.color': 'Color',
    'detail.description': 'Descripción:',
    'detail.price': 'Precio:',
    'detail.address': 'Dirección:',
    'detail.inWishlist': 'En tus deseados',
    'detail.addWishlist': 'Agregar a deseados',
    'detail.makeReservation': 'Realizar reserva',
    'detail.fullAddress': 'Dirección completa:',
    'detail.delete': 'Eliminar publicación',
    'detail.deleting': 'Eliminando…',
    'detail.deleteConfirm': '¿Seguro que deseas eliminar esta publicación? Se borrará del catálogo y no se puede deshacer.',

    // Reserva
    'reserva.title': 'Reservar vehículo',
    'reserva.details': 'Detalles de la reserva',
    'reserva.startDate': 'Fecha de inicio',
    'reserva.endDate': 'Fecha de fin',
    'reserva.bookerName': 'Nombre de quien reserva',
    'reserva.deliveryPlace': 'Lugar de entrega',
    'reserva.dateError': 'La fecha de fin debe ser posterior a la de inicio.',
    'reserva.overlapError': 'El rango elegido se cruza con una reserva existente. Elige otras fechas.',
    'reserva.unavailableDates': 'Fechas no disponibles',
    'reserva.paymentSummary': 'Resumen de pago',
    'reserva.serviceFee': 'Tarifa de servicio (10%)',
    'reserva.total': 'Total',
    'reserva.paymentMethod': 'Método de pago',
    'reserva.datesUnavailable': 'Fechas no disponibles',
    'reserva.selectValidDates': 'Selecciona fechas válidas',
    'reserva.paypalError': 'Hubo un problema con el pago de PayPal.',
    'reserva.success': '¡Reserva y pago realizados con éxito!',

    // Mis vehículos
    'myVehicles.title': 'Mis vehiculos',
    'myVehicles.empty': 'Aún no has publicado vehículos. Usa el botón + para agregar uno.',

    // Nuevo vehículo
    'vehicle.addVehicle': 'Agregar vehículo',
    'newVehicle.title': 'Nuevo vehículo',
    'newVehicle.vehicleData': 'Datos del vehículo',
    'newVehicle.notAllShared': 'No todos los datos serán compartidos al público',
    'newVehicle.sharedData': 'Datos compartidos',
    'newVehicle.category': 'Categoría',
    'newVehicle.postTitle': 'Título de publicación',
    'newVehicle.dailyRate': 'Tarifa diaria (USD)',
    'newVehicle.description': 'Descripción',
    'newVehicle.descPlaceholder': 'Motocicleta 700cc, excelente para tardes de rodadas y aventuras',
    'newVehicle.address': 'Dirección',
    'newVehicle.brand': 'Marca',
    'newVehicle.model': 'Modelo',
    'newVehicle.notSharedData': 'Datos no compartidos',
    'newVehicle.plateNumber': 'Número de placa',
    'newVehicle.holderName': 'Nombre del titular',
    'newVehicle.holderPlaceholder': 'Nombre completo del titular',
    'newVehicle.createPost': 'Crear publicación',
    'newVehicle.dragPhotos': 'Arrastra tus fotos aquí',
    'newVehicle.clickToBrowse': 'O haz click para explorar tus archivos',
    'newVehicle.publishing': 'Publicando…',
    'newVehicle.success': 'Publicación creada con éxito!',

    // Favoritos
    'favorites.title': 'Favoritos',
    'favorites.empty': 'Aún no tienes vehículos en favoritos.',

    // Menú de usuario
    'menu.addVehicle': 'Agregar Vehículo',
    'menu.myVehicles': 'Mis vehículos',
    'menu.logout': 'Cerrar Sesión',

    // PayPal
    'paypal.card': 'Tarjeta de débito o crédito',
    'paypal.secure': 'Pago seguro procesado por PayPal',
  },

  EN: {
    // Common
    'common.user': 'User',
    'common.loading': 'Loading…',
    'common.loadingVehicles': 'Loading vehicles…',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.cancel': 'Cancel',
    'common.accept': 'OK',
    'common.delete': 'Delete',
    'common.errorTitle': 'An error occurred',
    'common.brand': 'Brand',
    'common.model': 'Model',
    'common.perDay': 'day',
    'common.day': 'day',
    'common.days': 'days',
    'common.vehicleNotFound': 'Vehicle not found.',

    // Auth
    'auth.loginRegister': 'Log in/Sign up',
    'auth.tagline': 'Connect with machinery and vehicles',
    'auth.login': 'Log in',
    'auth.register': 'Sign up',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.loggingIn': 'Logging in…',
    'auth.fullName': 'Full name',
    'auth.phone': 'Phone',
    'auth.selectRole': 'Select a role:',
    'auth.creating': 'Creating…',
    'auth.createAccount': 'Create Account',
    'auth.showPassword': 'Show password',
    'auth.hidePassword': 'Hide password',

    // Roles
    'role.arrendador': 'Owner',
    'role.cliente': 'Customer',

    // Search
    'search.placeholderVehicle': 'Search by vehicle, brand, model',
    'search.placeholderLocation': 'Location or city',

    // Home
    'home.goCatalog': 'Go to catalog',
    'home.title': 'Bahn | Vehicle rental',
    'home.subtitle': 'Cars, motorcycles and machinery all in one place!',
    'home.searchPlaceholder': 'What vehicle or machinery do you need?',
    'home.featured': 'Featured listings',
    'home.exploreCatalog': 'Explore catalog',

    // Categories
    'cat.Autos': 'Cars',
    'cat.Motocicletas': 'Motorcycles',
    'cat.Maquinaria Pesada': 'Heavy Machinery',
    'cat.Agrícola': 'Agricultural',

    // Catalog
    'catalog.results': 'Results',
    'catalog.noResults': 'No vehicles found with those filters.',

    // Filters
    'filter.title': 'Filter',
    'filter.categories': 'Categories',
    'filter.brand': 'Brand',
    'filter.model': 'Model',
    'filter.priceRange': 'Price range',
    'filter.address': 'Address',
    'filter.addressPlaceholder': 'City, Department',
    'filter.condition': 'Condition',
    'filter.any': 'Any',

    // Weights
    'weight.Liviano': 'Light',
    'weight.Mediano': 'Medium',
    'weight.Pesado': 'Heavy',

    // Conditions
    'cond.Excelente': 'Excellent',
    'cond.Buena': 'Good',
    'cond.Regular': 'Fair',

    // Vehicle card
    'fav.add': 'Add to favorites',
    'fav.remove': 'Remove from favorites',

    // Detail
    'detail.specs': 'Specifications:',
    'detail.year': 'Year',
    'detail.km': 'KM',
    'detail.visualCondition': 'Visual condition',
    'detail.color': 'Color',
    'detail.description': 'Description:',
    'detail.price': 'Price:',
    'detail.address': 'Address:',
    'detail.inWishlist': 'In your wishlist',
    'detail.addWishlist': 'Add to wishlist',
    'detail.makeReservation': 'Make reservation',
    'detail.fullAddress': 'Full address:',
    'detail.delete': 'Delete listing',
    'detail.deleting': 'Deleting…',
    'detail.deleteConfirm': 'Are you sure you want to delete this listing? It will be removed from the catalog and cannot be undone.',

    // Reservation
    'reserva.title': 'Book vehicle',
    'reserva.details': 'Reservation details',
    'reserva.startDate': 'Start date',
    'reserva.endDate': 'End date',
    'reserva.bookerName': 'Name of the person booking',
    'reserva.deliveryPlace': 'Delivery location',
    'reserva.dateError': 'The end date must be after the start date.',
    'reserva.overlapError': 'The selected range overlaps with an existing reservation. Choose other dates.',
    'reserva.unavailableDates': 'Unavailable dates',
    'reserva.paymentSummary': 'Payment summary',
    'reserva.serviceFee': 'Service fee (10%)',
    'reserva.total': 'Total',
    'reserva.paymentMethod': 'Payment method',
    'reserva.datesUnavailable': 'Dates unavailable',
    'reserva.selectValidDates': 'Select valid dates',
    'reserva.paypalError': 'There was a problem with the PayPal payment.',
    'reserva.success': 'Reservation and payment completed successfully!',

    // My vehicles
    'myVehicles.title': 'My vehicles',
    'myVehicles.empty': 'You have not posted any vehicles yet. Use the + button to add one.',

    // New vehicle
    'vehicle.addVehicle': 'Add vehicle',
    'newVehicle.title': 'New vehicle',
    'newVehicle.vehicleData': 'Vehicle data',
    'newVehicle.notAllShared': 'Not all data will be shared with the public',
    'newVehicle.sharedData': 'Shared data',
    'newVehicle.category': 'Category',
    'newVehicle.postTitle': 'Listing title',
    'newVehicle.dailyRate': 'Daily rate (USD)',
    'newVehicle.description': 'Description',
    'newVehicle.descPlaceholder': '700cc motorcycle, great for afternoon rides and adventures',
    'newVehicle.address': 'Address',
    'newVehicle.brand': 'Brand',
    'newVehicle.model': 'Model',
    'newVehicle.notSharedData': 'Data not shared',
    'newVehicle.plateNumber': 'Plate number',
    'newVehicle.holderName': 'Holder name',
    'newVehicle.holderPlaceholder': 'Full name of the holder',
    'newVehicle.createPost': 'Create listing',
    'newVehicle.dragPhotos': 'Drag your photos here',
    'newVehicle.clickToBrowse': 'Or click to browse your files',
    'newVehicle.publishing': 'Publishing…',
    'newVehicle.success': 'Listing created successfully!',

    // Favorites
    'favorites.title': 'Favorites',
    'favorites.empty': 'You have no favorite vehicles yet.',

    // User menu
    'menu.addVehicle': 'Add Vehicle',
    'menu.myVehicles': 'My vehicles',
    'menu.logout': 'Log out',

    // PayPal
    'paypal.card': 'Debit or credit card',
    'paypal.secure': 'Secure payment processed by PayPal',
  },
}

// Traducción de mensajes de error que llegan del backend (en español).
// La clave es el texto exacto que devuelve el servidor.
const ERROR_TRANSLATIONS = {
  'Credenciales incorrectas': 'Incorrect credentials',
  'Correo y contraseña requeridos': 'Email and password are required',
  'El correo ya está registrado': 'The email is already registered',
  'Nombre, correo y contraseña son obligatorios': 'Name, email and password are required',
  'Usuario no encontrado': 'User not found',
  'Vehículo no encontrado': 'Vehicle not found',
  'Título y categoría son obligatorios': 'Title and category are required',
  'Faltan datos de la reserva': 'Reservation data is missing',
  'No tienes permiso para eliminar esta publicación': 'You do not have permission to delete this listing',
  'Error al iniciar sesión': 'Login error',
  'Error al registrar': 'Registration error',
  'Error al crear el vehículo': 'Error creating the vehicle',
  'Error al eliminar el vehículo': 'Error deleting the vehicle',
  'Error al actualizar favoritos': 'Error updating favorites',
}

// Hook de traducción: devuelve t(clave) y tErr(mensajeBackend) según el idioma activo.
export function useT() {
  const { lang } = useAuth()
  const dict = translations[lang] || translations.ES
  const t = (key) => {
    if (dict[key] !== undefined) return dict[key]
    if (translations.ES[key] !== undefined) return translations.ES[key]
    return key
  }
  // Traduce un mensaje de error del backend. Si el mensaje tiene la forma
  // "Prefijo: detalle", traduce el prefijo conocido y conserva el detalle.
  const tErr = (message) => {
    if (!message || lang !== 'EN') return message
    if (ERROR_TRANSLATIONS[message]) return ERROR_TRANSLATIONS[message]
    const idx = message.indexOf(': ')
    if (idx > -1) {
      const prefix = message.slice(0, idx)
      if (ERROR_TRANSLATIONS[prefix]) return ERROR_TRANSLATIONS[prefix] + ': ' + message.slice(idx + 2)
    }
    return message
  }
  return { t, tErr, lang }
}
