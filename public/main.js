const socket = io('https://sorteo-97ny.onrender.com');
        const grid = document.getElementById('grid');
    
        // Cargar números
        fetch('https://sorteo-97ny.onrender.com/api/numeros')
            .then((res) => res.json())
            .then((data) => {
                data.forEach((num) => {
                    const div = document.createElement('div');
                    div.className = `numero ${num.estado}`;
                    div.textContent = num.numero;
    
                    // Manejar clic para cambiar estado
                    div.addEventListener('click', () => {
                        const nuevoEstado = div.classList.contains('disponible') ? 'vendido' : 'disponible';
                        div.classList.toggle('disponible');
                        div.classList.toggle('vendido');
    
                        fetch(`https://sorteo-97ny.onrender.com/api/numeros/${num.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ estado: nuevoEstado, usuario: 'usuario1' }),
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    alert('Hubo un error al actualizar el estado en la base de datos');
                                    // Revertir cambios en la UI si falla la solicitud
                                    div.classList.toggle('disponible');
                                    div.classList.toggle('vendido');
                                }
                            });
    
                        // Notificar a otros usuarios en tiempo real
                        socket.emit('marcarNumero', { id: num.id, estado: nuevoEstado });
                    });
    
                    grid.appendChild(div);
                });
            });

        // Actualizar números en tiempo real
        socket.on('numeroMarcado', ({ id, estado }) => {
            const div = document.querySelector(`.numero:nth-child(${id})`);
            if (div) {
                div.classList.remove('vendido', 'disponible');
                div.classList.add(estado);
            }
        });