// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Define all selection sections
    const sections = [
        { id: 'location-selection', element: document.querySelector('.location-selection') },
        { id: 'service-categories', element: document.querySelector('.service-categories') },
        { id: 'service-selection', element: document.querySelector('.service-selection') },
        { id: 'stylist-selection', element: document.querySelector('.stylist-selection') },
        { id: 'datetime-selection', element: document.querySelector('.datetime-selection') }
    ];
    
    // Store selected data
    const selectedData = {
        location: null,
        services: [],
        stylist: null,
        timeSlot: null
    };
    
    // Hide all sections except the first one
    function initializeSections() {
        sections.forEach((section, index) => {
            if (index === 0) {
                section.element.classList.add('active-section');
            } else {
                section.element.classList.add('hidden');
            }
        });
        
        // Hide continue button initially
        document.getElementById('continue-to-booking').classList.add('hidden');
    }
    
    // Function to move to the next section
    function moveToSection(currentSectionId, nextSectionId) {
        const currentSection = sections.find(section => section.id === currentSectionId);
        const nextSection = sections.find(section => section.id === nextSectionId);
        
        if (currentSection && nextSection) {
            currentSection.element.classList.remove('active-section');
            currentSection.element.classList.add('hidden');
            nextSection.element.classList.remove('hidden');
            nextSection.element.classList.add('active-section');
            
            // Show continue button only on the last section
            if (nextSectionId === 'datetime-selection') {
                document.getElementById('continue-to-booking').classList.remove('hidden');
            } else {
                document.getElementById('continue-to-booking').classList.add('hidden');
            }
        }
    }
    
    // Initialize sections
    initializeSections();
    
    // 1. Service Category Tab Switching
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all service lists
            const serviceLists = document.querySelectorAll('.service-list');
            serviceLists.forEach(list => list.classList.add('hidden'));
            
            // Show the selected category's service list
            const category = tab.getAttribute('data-category');
            document.querySelector(`.service-list[data-category="${category}"]`).classList.remove('hidden');
        });
    });

    // 2. Location Selection
    const locationButtons = document.querySelectorAll('.location-item .btn');
    locationButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from all location buttons
            locationButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.textContent = 'Select';
            });
            
            // Add selected class to clicked button
            button.classList.add('selected');
            button.textContent = 'Selected';
            
            // Store selected location
            const locationItem = button.closest('.location-item');
            selectedData.location = locationItem.querySelector('h4').textContent;
            
            // Update stylist list based on selected location
            updateStylistsByLocation(selectedData.location);
            
            // Move directly to combined service categories and selection section
            moveToSection('location-selection', 'service-categories');
            
            // Make service selection visible immediately
            const serviceSelectionSection = sections.find(section => section.id === 'service-selection');
            if (serviceSelectionSection) {
                serviceSelectionSection.element.classList.remove('hidden');
            }
            
            // Show the default category's service list (hair)
            const defaultCategory = 'hair';
            document.querySelector(`.service-list[data-category="${defaultCategory}"]`).classList.remove('hidden');
        });
    });
    
    // 3. Service Selection - Modified to allow multiple selections
    const serviceButtons = document.querySelectorAll('.service-item .btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const serviceItem = button.closest('.service-item');
            const serviceName = serviceItem.querySelector('h4').textContent;
            const servicePrice = serviceItem.querySelector('p').textContent;
            
            if (button.classList.contains('selected')) {
                // Deselect if already selected
                button.classList.remove('selected');
                button.textContent = 'Select';
                serviceItem.classList.remove('selected-service');
                
                // Remove from selected services array
                const index = selectedData.services.findIndex(service => service.name === serviceName);
                if (index > -1) {
                    selectedData.services.splice(index, 1);
                }
            } else {
                // Add to selected services
                button.classList.add('selected');
                button.textContent = 'Remove';
                serviceItem.classList.add('selected-service');
                selectedData.services.push({
                    name: serviceName,
                    price: servicePrice
                });
            }
            
            // Update the selected services counter
            updateSelectedServicesCounter();
            
            // Show/hide continue button based on selections
            updateContinueButton();
        });
    });
    
    // Function to update the selected services counter
    function updateSelectedServicesCounter() {
        let counterElement = document.querySelector('.selected-services-counter');
        
        if (!counterElement && selectedData.services.length > 0) {
            counterElement = document.createElement('div');
            counterElement.className = 'selected-services-counter';
            document.querySelector('.service-selection h3').appendChild(counterElement);
        }
        
        if (counterElement) {
            if (selectedData.services.length > 0) {
                counterElement.textContent = `${selectedData.services.length} selected`;
                counterElement.style.display = 'inline-block';
            } else {
                counterElement.style.display = 'none';
            }
        }
    }
    
    // Function to update continue button visibility
    function updateContinueButton() {
        let continueServiceBtn = document.querySelector('.continue-service-btn');
        
        if (selectedData.services.length > 0) {
            if (!continueServiceBtn) {
                continueServiceBtn = document.createElement('button');
                continueServiceBtn.className = 'btn primary-btn continue-service-btn';
                continueServiceBtn.textContent = 'Continue with Selected Services';
                document.querySelector('.service-selection').appendChild(continueServiceBtn);
                
                continueServiceBtn.addEventListener('click', () => {
                    moveToSection('service-selection', 'stylist-selection');
                });
            }
        } else if (continueServiceBtn) {
            continueServiceBtn.remove();
        }
    }

    // 4. Stylist Selection with location-based filtering
    function updateStylistsByLocation(location) {
        // Clear existing stylists
        const stylistList = document.querySelector('.stylist-list');
        stylistList.innerHTML = '';
        
        // Define stylists by location
        const stylistsByLocation = {
            'Hair Affair Puri': [
                { name: 'Nina', title: 'Senior Stylist', rating: '4.9' },
                { name: 'John', title: 'Junior Stylist', rating: '4.7' }
            ],
            'Hair Affair Pakubuwono': [
                { name: 'Maria', title: 'Master Stylist', rating: '5.0' },
                { name: 'Alex', title: 'Senior Stylist', rating: '4.8' }
            ],
            'Hair Affair Senayan City': [
                { name: 'David', title: 'Master Stylist', rating: '4.9' },
                { name: 'Sarah', title: 'Senior Stylist', rating: '4.8' },
                { name: 'Lisa', title: 'Junior Stylist', rating: '4.6' }
            ]
        };
        
        // Get stylists for selected location
        const stylists = stylistsByLocation[location] || [];
        
        // Create stylist elements
        stylists.forEach(stylist => {
            const stylistItem = document.createElement('div');
            stylistItem.className = 'stylist-item';
            stylistItem.innerHTML = `
                <div class="stylist-avatar">
                    <img src="https://via.placeholder.com/60x60?text=${stylist.name}" alt="Stylist ${stylist.name}">
                </div>
                <div class="stylist-info">
                    <h4>${stylist.name}</h4>
                    <p>${stylist.title} • ${stylist.rating} ★</p>
                </div>
                <button class="btn outline-btn small-btn">Select</button>
            `;
            
            stylistList.appendChild(stylistItem);
        });
        
        // Add event listeners to new stylist buttons
        const stylistButtons = document.querySelectorAll('.stylist-item .btn');
        stylistButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove selected class from all stylist buttons
                stylistButtons.forEach(btn => {
                    btn.classList.remove('selected');
                    btn.textContent = 'Select';
                });
                
                // Add selected class to clicked button
                button.classList.add('selected');
                button.textContent = 'Selected';
                
                // Store selected stylist
                const stylistItem = button.closest('.stylist-item');
                selectedData.stylist = {
                    name: stylistItem.querySelector('h4').textContent,
                    title: stylistItem.querySelector('p').textContent.split('•')[0].trim()
                };
                
                // Move to next section after stylist is selected
                moveToSection('stylist-selection', 'datetime-selection');
            });
        });
    }

    // 5. Time Slot Selection with distinct styling for availability
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        if (slot.classList.contains('available')) {
            slot.addEventListener('click', () => {
                // Remove selected class from all time slots
                timeSlots.forEach(s => s.classList.remove('selected'));
                
                // Add selected class to clicked time slot
                slot.classList.add('selected');
                
                // Store selected time slot
                selectedData.timeSlot = slot.textContent;
                
                // Show the continue to booking button
                document.getElementById('continue-to-booking').classList.remove('hidden');
            });
        }
    });

    // 6. Navigation between screens
    // Continue to Booking button
    const continueToBookingBtn = document.getElementById('continue-to-booking');
    continueToBookingBtn.addEventListener('click', () => {
        // Update booking summary with selected services
        updateBookingSummary();
        
        // Hide current screen
        document.getElementById('browse-select-screen').classList.remove('active');
        // Show booking & payment screen
        document.getElementById('booking-payment-screen').classList.add('active');
    });
    
    // Function to update booking summary with multiple services
    function updateBookingSummary() {
        if (selectedData.services.length > 0) {
            // Get the summary container
            const summaryContainer = document.querySelector('.booking-summary-card .card-content');
            
            // Clear existing service summary
            const existingServiceSummaries = summaryContainer.querySelectorAll('.summary-item');
            existingServiceSummaries.forEach((item, index) => {
                if (index === 0) {
                    item.remove();
                }
            });
            
            // Add each selected service as a separate line item
            selectedData.services.forEach((service, index) => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'summary-item';
                serviceItem.innerHTML = `
                    <span class="summary-label">Service ${index + 1}:</span>
                    <span class="summary-value">${service.name}</span>
                `;
                
                // Insert at the beginning of the summary
                summaryContainer.insertBefore(serviceItem, summaryContainer.firstChild);
            });
            
            // Update stylist and location in summary
            const summaryItems = summaryContainer.querySelectorAll('.summary-item');
            summaryItems.forEach(item => {
                const label = item.querySelector('.summary-label').textContent;
                const value = item.querySelector('.summary-value');
                
                if (label === 'Stylist:' && selectedData.stylist) {
                    value.textContent = `${selectedData.stylist.name} (${selectedData.stylist.title})`;
                } else if (label === 'Location:' && selectedData.location) {
                    value.textContent = selectedData.location;
                } else if (label === 'Date & Time:' && selectedData.timeSlot) {
                    const currentDate = new Date();
                    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    value.textContent = `${formattedDate} • ${selectedData.timeSlot}`;
                } else if (label === 'Duration:') {
                    // Calculate total estimated duration from all services
                    let totalHours = 0;
                    let totalMinutes = 0;
                    
                    selectedData.services.forEach(service => {
                        // Extract duration from service price text (e.g., "From IDR 450,000 • 2 hours" or "From IDR 300,000 • 45 minutes")
                        const durationMatch = service.price.match(/(\d+)\s*(hour|hours|minute|minutes)/i);
                        if (durationMatch) {
                            const amount = parseInt(durationMatch[1]);
                            const unit = durationMatch[2].toLowerCase();
                            
                            if (unit.includes('hour')) {
                                totalHours += amount;
                            } else if (unit.includes('minute')) {
                                totalMinutes += amount;
                            }
                        }
                    });
                    
                    // Convert excess minutes to hours
                    totalHours += Math.floor(totalMinutes / 60);
                    totalMinutes = totalMinutes % 60;
                    
                    // Format the duration string
                    let durationText = '';
                    if (totalHours > 0) {
                        durationText += `${totalHours} hour${totalHours !== 1 ? 's' : ''}`;
                    }
                    if (totalMinutes > 0) {
                        if (durationText) durationText += ' ';
                        durationText += `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}`;
                    }
                    
                    // Add note that duration is estimated
                    value.textContent = `${durationText} (estimated)`;
                }
            });
            
            // Update price breakdown
            updatePriceBreakdown();
        }
    }
    
    // Function to update price breakdown based on selected services
    function updatePriceBreakdown() {
        const priceBreakdownContainer = document.querySelector('.price-breakdown-card .card-content');
        
        // Clear existing price items except the total and miles equivalent
        const priceItems = priceBreakdownContainer.querySelectorAll('.price-item:not(.total):not(.miles-equivalent)');
        priceItems.forEach(item => item.remove());
        
        // Get total and miles equivalent elements
        const totalElement = priceBreakdownContainer.querySelector('.price-item.total');
        const milesElement = priceBreakdownContainer.querySelector('.price-item.miles-equivalent');
        
        // Add each selected service as a price item
        let totalPrice = 0;
        selectedData.services.forEach(service => {
            // Extract price from the service price text (e.g., "From IDR 450,000 • 2 hours")
            const priceMatch = service.price.match(/IDR ([0-9,]+)/);
            if (priceMatch && priceMatch[1]) {
                const price = parseInt(priceMatch[1].replace(/,/g, ''));
                totalPrice += price;
                
                const priceItem = document.createElement('div');
                priceItem.className = 'price-item';
                priceItem.innerHTML = `
                    <span>${service.name}</span>
                    <span>IDR ${price.toLocaleString()}</span>
                `;
                
                // Insert before the total
                priceBreakdownContainer.insertBefore(priceItem, totalElement);
            }
        });
        
        // Get selected voucher
        const voucherSelect = document.getElementById('voucher-select');
        const selectedVoucher = voucherSelect.value;
        let discountPercentage = 0;
        let discountLabel = '';
        
        // Determine discount percentage based on selected voucher
        if (selectedVoucher === 'new-customer') {
            discountPercentage = 10;
            discountLabel = 'New Customer Discount (10%)';
        } else if (selectedVoucher === 'birthday') {
            discountPercentage = 15;
            discountLabel = 'Birthday Month Discount (15%)';
        } else if (selectedVoucher === 'loyalty') {
            discountPercentage = 20;
            discountLabel = 'Loyalty Discount (20%)';
        }
        
        // Remove existing discount element if any
        const existingDiscountElement = priceBreakdownContainer.querySelector('.price-item.discount');
        if (existingDiscountElement) {
            existingDiscountElement.remove();
        }
        
        // Update total and miles equivalent
        let finalPrice = totalPrice;
        
        // Add discount if a voucher is selected
        if (discountPercentage > 0) {
            const discountAmount = Math.round(totalPrice * (discountPercentage / 100));
            
            const discountElement = document.createElement('div');
            discountElement.className = 'price-item discount';
            discountElement.innerHTML = `
                <span>${discountLabel}</span>
                <span>- IDR ${discountAmount.toLocaleString()}</span>
            `;
            
            // Insert before the total
            priceBreakdownContainer.insertBefore(discountElement, totalElement);
            
            finalPrice = totalPrice - discountAmount;
        }
        
        // Update total price
        const totalSpans = totalElement.querySelectorAll('span');
        totalSpans[1].textContent = `IDR ${finalPrice.toLocaleString()}`;
        
        // Update miles equivalent (assuming 1 IDR = 0.1 miles)
        const milesSpans = milesElement.querySelectorAll('span');
        const milesEquivalent = Math.round(finalPrice * 0.1);
        milesSpans[1].textContent = `${milesEquivalent.toLocaleString()} Miles`;
    }

    // Confirm Booking button
    const confirmBookingBtn = document.getElementById('confirm-booking');
    confirmBookingBtn.addEventListener('click', () => {
        // Update appointment details in confirmation screen with the estimated duration
        const durationItem = document.querySelector('.appointment-details-list .detail-item:nth-child(4) span');
        const summaryDuration = document.querySelector('.booking-summary-card .summary-item:nth-child(5) .summary-value');
        if (durationItem && summaryDuration) {
            durationItem.textContent = summaryDuration.textContent;
        }
        
        // Hide current screen
        document.getElementById('booking-payment-screen').classList.remove('active');
        // Show confirmation screen
        document.getElementById('booking-confirmation-screen').classList.add('active');
    });

    // Back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the current active screen
            const currentScreen = document.querySelector('.screen.active');
            
            if (currentScreen.id === 'booking-payment-screen') {
                // Go back to browse & select screen
                currentScreen.classList.remove('active');
                document.getElementById('browse-select-screen').classList.add('active');
            } else if (currentScreen.id === 'booking-confirmation-screen') {
                // Go back to booking & payment screen
                currentScreen.classList.remove('active');
                document.getElementById('booking-payment-screen').classList.add('active');
            } else {
                // Default: go back to home
                window.location.href = 'index.html';
            }
        });
    });
    
    // Add back navigation within sections
    sections.forEach((section, index) => {
        if (index > 0) {
            // Check if back button already exists
            let backBtn = section.element.querySelector('.section-back-btn');
            
            if (!backBtn) {
                backBtn = document.createElement('button');
                backBtn.className = 'section-back-btn';
                backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
                section.element.insertBefore(backBtn, section.element.firstChild);
            }
            
            backBtn.addEventListener('click', () => {
                // Determine previous section
                const previousSection = sections[index - 1];
                
                // Hide current section
                section.element.classList.remove('active-section');
                section.element.classList.add('hidden');
                
                // Show previous section
                previousSection.element.classList.remove('hidden');
                previousSection.element.classList.add('active-section');
                
                // Hide continue button when going back from last section
                if (index === sections.length - 1) {
                    document.getElementById('continue-to-booking').classList.add('hidden');
                }
            });
        }
    });
    
    // Add some CSS for the new elements
    const style = document.createElement('style');
    style.textContent = `
        .hidden {
            display: none !important;
        }
        .active-section {
            display: block;
        }
        .section-back-btn {
            background: none;
            border: none;
            color: #333;
            font-size: 14px;
            margin-bottom: 15px;
            cursor: pointer;
        }
        .section-back-btn:hover {
            color: #000;
        }
        .continue-service-btn, .continue-category-btn {
            margin-top: 20px;
        }
        .selected-service {
            background-color: rgba(0, 128, 0, 0.05);
            border-left: 3px solid green;
        }
        .selected-services-counter {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            border-radius: 12px;
            padding: 2px 8px;
            font-size: 12px;
            margin-left: 10px;
        }
        .time-slot {
            padding: 10px;
            margin: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
        }
        .time-slot.available {
            background-color: #e8f5e9;
            color: #2e7d32;
            border-color: #a5d6a7;
        }
        .time-slot.unavailable {
            background-color: #f5f5f5;
            color: #9e9e9e;
            border-color: #e0e0e0;
            cursor: not-allowed;
            text-decoration: line-through;
        }
        .time-slot.selected {
            background-color: #2e7d32;
            color: white;
            border-color: #1b5e20;
        }
    `;
    document.head.appendChild(style);
});

// Add event listener for voucher selection
document.addEventListener('DOMContentLoaded', function() {
    // Voucher selection event listener
    const voucherSelect = document.getElementById('voucher-select');
    if (voucherSelect) {
        voucherSelect.addEventListener('change', function() {
            updatePriceBreakdown();
        });
    }
});