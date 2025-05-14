$(document).ready(function() {
    // Check if localStorage is supported
    function isLocalStorageSupported() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch(e) {
            return false;
        }
    }

    // Initialize workouts array from localStorage or create empty array
    let workouts = [];
    if (isLocalStorageSupported()) {
        const storedWorkouts = localStorage.getItem('workouts');
        if (storedWorkouts) {
            workouts = JSON.parse(storedWorkouts);
            updateWorkoutHistory();
        }
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Validate workout name
        const workoutName = $('#workoutName').val().trim();
        if (workoutName === '') {
            $('#nameError').text('Palun sisesta treeningu nimetus');
            isValid = false;
        } else {
            $('#nameError').text('');
        }
        
        // Validate duration
        const duration = $('#workoutDuration').val().trim();
        if (duration === '' || duration <= 0) {
            $('#durationError').text('Palun sisesta kehtiv kestus');
            isValid = false;
        } else {
            $('#durationError').text('');
        }
        
        // Validate date
        const date = $('#workoutDate').val();
        if (date === '') {
            $('#dateError').text('Palun vali kuupäev');
            isValid = false;
        } else {
            $('#dateError').text('');
        }
        
        return isValid;
    }

    // Handle form submission
    $('#workoutForm').on('submit', function(e) {
        e.preventDefault();
        
        console.log('Form submitted, validating...');
        
        if (validateForm()) {
            // Get form values
            const workout = {
                name: $('#workoutName').val().trim(),
                duration: $('#workoutDuration').val().trim(),
                date: $('#workoutDate').val(),
                notes: $('#workoutNotes').val().trim(),
                id: Date.now() // Unique ID for the workout
            };
            
            console.log('Workout data:', workout);
            
            // Add to workouts array
            workouts.push(workout);
            
            // Save to localStorage if supported
            if (isLocalStorageSupported()) {
                localStorage.setItem('workouts', JSON.stringify(workouts));
                console.log('Workout saved to localStorage');
            }
            
            // Update the workout history
            updateWorkoutHistory();
            
            // Show success message
            $('#successMessage').removeClass('hidden');
            
            // Change the header image
            $('#headerImage').attr('src', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
            
            // Reset the form
            $('#workoutForm')[0].reset();
            
            // Hide success message after 3 seconds
            setTimeout(function() {
                $('#successMessage').addClass('hidden');
            }, 3000);
        } else {
            console.log('Form validation failed');
        }
    });

    // Toggle workout history visibility
    $('#toggleHistory').on('click', function() {
        $('#workoutHistory').toggleClass('hidden');
    });

    // Update workout history display
    function updateWorkoutHistory() {
        const $workoutsList = $('#workoutsList');
        $workoutsList.empty();
        
        if (workouts.length === 0) {
            $('#noWorkouts').show();
        } else {
            $('#noWorkouts').hide();
            
            // Sort workouts by date (newest first)
            workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Add each workout to the list
            workouts.forEach(function(workout) {
                const formattedDate = new Date(workout.date).toLocaleDateString('et-EE');
                const $workoutItem = $(`
                    <li class="workout-item">
                        <div class="workout-date">${formattedDate}</div>
                        <div class="workout-details">
                            <strong>${workout.name}</strong> - ${workout.duration} minutit
                            ${workout.notes ? '<p>' + workout.notes + '</p>' : ''}
                        </div>
                    </li>
                `);
                
                $workoutsList.append($workoutItem);
            });
        }
    }

    // Set today's date as the default date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    $('#workoutDate').val(`${year}-${month}-${day}`);
});
