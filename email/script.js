document.addEventListener('DOMContentLoaded', function() {
    const departamentos = {

        'Alto Paraguay': ['Bahía Negra', 'Capitán Carmelo Peralta', 'Fuerte Olimpo', 'Puerto Casado'],
        'Alto Paraná': ['Ciudad del Este', 'Doctor Juan León Mallorquín', 'Doctor Raúl Peña', 'Domingo Martínez de Irala', 'Hernandarias', 'Iruña', 'Itakyry', 'Juan Emilio O Leary', 'Los Cedrales', 'Mbaracayú', 'Minga Guazú', 'Minga Porá', 'Naranjal', 'Ñacunday', 'Presidente Franco', 'San Alberto', 'Santa Fe del Paraná', 'Santa Rita', 'Santa Rosa del Monday', 'Tavapy'],
        'Amambay': ['Bella Vista', 'Capitán Bado', 'Karapaí', 'Pedro Juan Caballero', 'Zanja Pytá'],
        'Boquerón': ['Filadelfia', 'Loma Plata', 'Mariscal Estigarribia'],
        'Caaguazú': ['Caaguazú', 'Carayaó', 'Cecilio Báez', 'Doctor Juan Manuel Frutos', 'José Domingo Ocampos', 'La Pastora', 'Mcal. Francisco S. López', 'Nueva Londres', 'Nueva Toledo', 'R.I. 3 Corrales', 'Raúl Arsenio Oviedo', 'Repatriación', 'San Joaquín', 'San José de los Arroyos', 'Simón Bolívar', 'Tres de Febrero', 'Vaquería', 'Yhu'],
        'Caazapá': ['Abai', 'Buena Vista', 'Caazapá', 'Doctor Moisés S. Bertoni', 'Fulgencio Yegros', 'Gral. Higinio Morínigo', 'Maciel', 'San Juan Nepomuceno', 'Tavaí', 'Yuty'],
        'Canindeyú': ['Corpus Christi', 'Curuguaty', 'Gral. Francisco Caballero Álvarez', 'Itanará', 'Katueté', 'La Paloma', 'Nueva Esperanza', 'Salto del Guairá', 'Villa Ygatimí', 'Yasy Cañy', 'Yby Pytá', 'Ypejhú'],
        'Central': ['Asunción','Areguá', 'Capiatá', 'Fernando de la Mora', 'Guarambaré', 'Itá', 'Itauguá', 'J. Augusto Saldívar', 'Lambaré', 'Limpio', 'Luque', 'Mariano Roque Alonso', 'Ñemby', 'Nueva Italia', 'San Antonio', 'San Lorenzo', 'Villa Elisa', 'Villeta', 'Ypacaraí', 'Ypane'],
        'Concepción': ['Belén', 'Concepción', 'Horqueta', 'Loreto', 'San Carlos del Apa', 'San Lázaro', 'Yby Yaú'],
        'Cordillera': ['Altos', 'Atyrá', 'Arroyos y Esteros', 'Caacupé', 'Caraguatay', 'Emboscada', 'Eusebio Ayala', 'Isla Pucú', 'Itacurubí de la Cordillera', 'Juan de Mena', 'Loma Grande', 'Mbocayaty del Yhaguy', 'Nueva Colombia', 'Piribebuy', 'Primero de Marzo', 'San Bernardino', 'Santa Elena', 'Tobatí', 'Valenzuela'],
        'Guairá': ['Borja', 'Capitán Mauricio José Troche', 'Coronel Martínez', 'Dr. Botrell', 'Felipe S. Marecos', 'Gral. Eugenio A. Garay', 'Independencia', 'Iturbe', 'José Fassardi', 'Mbocayaty', 'Natalicio Talavera', 'Ñumí', 'San Salvador', 'Troche', 'Villarrica', 'Yataity'],
        'Itapúa': ['Alto Verá', 'Bella Vista', 'Cambyretá', 'Capitán Meza', 'Capitán Miranda', 'Carmen del Paraná', 'Coronel Bogado', 'Edelira', 'Encarnación', 'Gral. Artigas', 'Gral. Delgado', 'Hohenau', 'Jesús', 'La Paz', 'María Auxiliadora', 'Natívitas', 'Nueva Alborada', 'Obligado', 'Pirapó', 'San Cosme y Damián', 'San Juan del Paraná', 'San Pedro del Paraná', 'San Rafael del Paraná', 'Tomás Romero Pereira', 'Trinidad', 'Yatytay'],
        'Misiones': ['Ayolas', 'San Ignacio', 'San Juan Bautista', 'San Miguel', 'San Patricio', 'Santa María', 'Santa Rosa', 'Santiago', 'Villa Florida', 'Yabebyry'],
        'Paraguarí': ['Acahay', 'Caapucú', 'Carapeguá', 'Escobar', 'Gral. Bernardino Caballero', 'La Colmena', 'Mbuyapey', 'Paraguarí', 'Pirayú', 'Quiindy', 'Quyquyhó', 'San Roque González', 'Sapucai', 'Tebicuarymí', 'Yaguarón', 'Ybycuí'],
        'Presidente Hayes': ['Benjamín Aceval', 'Colonia Sargento José Félix López', 'Gral. José María Bruguez', 'Irala Fernández', 'José Falcón', 'Nanawa', 'Puerto Pinasco', 'Teniente Esteban Martínez', 'Villa Hayes'],
        'San Pedro': ['Antequera', 'Capiibary', 'Choré', 'Gral. Isidro Resquín', 'Gral. Elizardo Aquino', 'Guayaibí', 'Itacurubí del Rosario', 'Liberación', 'Lima', 'Naray', 'San Estanislao', 'San Pedro de Ycuamandiyú', 'Santa Rosa del Aguaray', 'Tacuatí', 'Unión'],
        'Paraguarí': ['Acahay', 'Caapucú', 'Carapeguá', 'Escobar', 'Gral. Bernardino Caballero', 'La Colmena', 'Mbuyapey', 'Paraguarí', 'Pirayú', 'Quiindy', 'Quyquyhó', 'San Roque González', 'Sapucai', 'Tebicuarymí', 'Yaguarón', 'Ybycuí'],
        'Ñeembucú': ['Alberdi', 'Cerrito', 'Desmochados', 'Gral. José Eduvigis Díaz', 'Guazú Cuá', 'Humaitá', 'Isla Umbú', 'Laureles', 'Mayor José Dejesús Martínez', 'Pilar', 'San Juan Bautista del Ñeembucú', 'Tacuaras', 'Villa Franca', 'Villa Oliva', 'Villa Victoria']
        // Agrega más departamentos y municipios según sea necesario
    };

    const departamentoSelect = document.getElementById('departamento');
    const municipioSelect = document.getElementById('municipio');

    for (let depto in departamentos) {
        let option = document.createElement('option');
        option.value = depto;
        option.text = depto;
        departamentoSelect.add(option);
    }

    departamentoSelect.addEventListener('change', function() {
        let municipios = departamentos[this.value];
        municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
        if (municipios) {
            municipios.forEach(function(municipio) {
                let option = document.createElement('option');
                option.value = municipio;
                option.text = municipio;
                municipioSelect.add(option);
            });
        }
    });

    const form = document.getElementById('consultaForm');
    const loading = document.getElementById('loading');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        loading.style.display = 'block';

        const formData = new FormData(form);

        fetch('send_mail.php', {
            method: 'POST',
            body: formData
        }).then(response => response.text())
        .then(data => {
            loading.style.display = 'none';
            successMessage.style.display = 'block';
            form.reset();
        }).catch(error => {
            loading.style.display = 'none';
            alert('Error al enviar la solicitud. Intente nuevamente.');
        });
    });
});


