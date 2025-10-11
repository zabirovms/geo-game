import React, { Component } from 'react';
import { gsap } from 'gsap';

class SimpleWorldMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      hoveredCountry: null
    };
  }

  componentDidMount() {
    this.loadWorldMapData();
  }

  loadWorldMapData = () => {
    // Load the SVG world map data
    fetch('/world-map.svg')
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const mapElement = svgDoc.querySelector('#map');
        
        if (mapElement && this.mapRef.current) {
          // Clone the map content and add to our container
          const mapContent = mapElement.cloneNode(true);
          mapContent.style.width = '100%';
          mapContent.style.height = '100%';
          mapContent.style.maxHeight = '500px';
          
          // Style the countries
          const countries = mapContent.querySelectorAll('path');
          countries.forEach(country => {
            country.style.fill = '#74B266';
            country.style.stroke = '#297373';
            country.style.strokeWidth = '1px';
            country.style.cursor = 'pointer';
            country.style.transition = 'fill 0.3s ease';
            
            // Add hover effects
            country.addEventListener('mouseenter', () => {
              country.style.fill = '#297373';
              const countryName = country.getAttribute('data-name');
              this.setState({ hoveredCountry: countryName });
            });
            
            country.addEventListener('mouseleave', () => {
              country.style.fill = '#74B266';
              this.setState({ hoveredCountry: null });
            });

            // Add click effect
            country.addEventListener('click', () => {
              gsap.to(country, {
                duration: 0.2,
                scale: 1.1,
                transformOrigin: 'center',
                ease: 'power2.out',
                onComplete: () => {
                  gsap.to(country, {
                    duration: 0.2,
                    scale: 1,
                    ease: 'power2.out'
                  });
                }
              });
            });
          });
          
          this.mapRef.current.appendChild(mapContent);
        }
      })
      .catch(error => {
        console.error('Error loading world map data:', error);
      });
  };

  render() {
    return (
      <div>
        <h4 className="text-center mb-3">Interactive World Map - Click to Explore</h4>
        {this.state.hoveredCountry && (
          <div className="text-center mb-2" style={{ 
            color: '#297373', 
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {this.state.hoveredCountry}
          </div>
        )}
        <div 
          ref={this.mapRef}
          style={{ 
            width: "100%", 
            height: "500px",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px solid #e9ecef'
          }}
        />
      </div>
    );
  }
}

export default SimpleWorldMap;
