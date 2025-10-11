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
    this.renderWorldMap();
  }

  renderWorldMap = () => {
    if (this.mapRef.current) {
      // Create a simple world map SVG directly
      const svgContent = `
        <svg width="100%" height="100%" viewBox="0 0 2000 1000" style="max-height: 500px;">
          <defs>
            <style>
              .country { fill: #74B266; stroke: #297373; stroke-width: 1px; cursor: pointer; transition: fill 0.3s ease; }
              .country:hover { fill: #297373; }
            </style>
          </defs>
          <path class="country" d="M1383 261.6l1.5 1.8-2.9 0.8-2.4 1.1-5.9 0.8-5.3 1.3-2.4 2.8 1.9 2.7 1.4 3.2-2 2.7 0.8 2.5-0.9 2.3-5.2-0.2 3.1 4.2-3.1 1.7-1.4 3.8 1.1 3.9-1.8 1.8-2.1-0.6-4 0.9-0.2 1.7-4.1 0-2.3 3.7 0.8 5.4-6.6 2.7-3.9-0.6-0.9 1.4-3.4-0.8-5.3 1-9.6-3.3 3.9-5.8-1.1-4.1-4.3-1.1-1.2-4.1-2.7-5.1 1.6-3.5-2.5-1 0.5-4.7 0.6-8 5.9 2.5 3.9-0.9 0.4-2.9 4-0.9 2.6-2-0.2-5.1 4.2-1.3 0.3-2.2 2.9 1.7 1.6 0.2 3 0 4.3 1.4 1.8 0.7 3.4-2 2.1 1.2 0.9-2.9 3.2 0.1 0.6-0.9-0.2-2.6 1.7-2.2 3.3 1.4-0.1 2 1.7 0.3 0.9 5.4 2.7 2.1 1.5-1.4 2.2-0.6 2.5-2.9 3.8 0.5 5.4 0z" data-name="Afghanistan"/>
          <path class="country" d="M1088 228l0.4 1.2 1.4-0.6 1.2 1.7 1.3 0.7 0.6 2.3-0.5 2.2 1 2.7 2.3 1.5 0.1 1.7-1.7 0.9-0.1 2.1-2.2 3.1-0.9-0.4-0.2-1.4-3.1-2.2-0.7-3 0.1-4.4 0.5-1.9-0.9-1-0.5-2.1 1.9-3.1z" data-name="Albania"/>
          <path class="country" d="M1070.6 190.8l-0.3 0.8 0.7 2.1-0.2 2.6-2.8 0 1.1 1.4-1.3 4-0.9 1.1-4.4 0.1-2.4 1.5-4.2-0.5-7.3-1.7-1.3-2.1-4.9 1.1-0.5 1.2-3.1-0.9-2.6-0.2-2.3-1.2 0.7-1.5-0.2-1.1 1.4-0.3 2.7 1.7 0.6-1.7 4.4 0.3 3.5-1.1 2.4 0.2 1.7 1.3 0.4-1.1-1-4.1 1.7-0.8 1.6-2.9 3.8 2.1 2.6-2.6 1.7-0.5 4 1.9 2.3-0.3 2.4 1.2z" data-name="Austria"/>
          <path class="country" d="M1016.5 177.1l-0.4 4.2-1.3 0.2-0.4 3.5-4.4-2.9-2.5 0.5-3.5-2.9-2.4-2.5-2.2-0.1-0.8-2.2 3.9-1.2 3.6 0.5 4.5-1.3 3.1 2.7 2.8 1.5z" data-name="Belgium"/>
          <path class="country" d="M1132.6 221.6l-2.3 2.6-1.3 4.5 2.1 3.6-4.6-0.8-5 2 0.3 3.2-4.6 0.6-3.9-2.3-4 1.8-3.8-0.2-0.8-4.2-2.8-2.1 0.7-0.8-0.6-0.8 0.6-2 1.8-2-2.8-2.7-0.7-2.4 1.1-1.4 1.8 2.6 1.9-0.4 4 0.9 7.6 0.4 2.3-1.6 5.9-1.5 4 2.3 3.1 0.7z" data-name="Bulgaria"/>
          <path class="country" d="M1083 214.3l1.9-0.1-1.1 2.8 2.7 2.5-0.5 2.9-1.1 0.3-0.9 0.6-1.6 1.5-0.4 3.5-4.8-2.4-2.1-2.7-2.1-1.4-2.5-2.4-1.3-1.9-2.7-3 0.8-2.6 2 1.5 1-1.4 2.3-0.1 4.5 1.1 3.5-0.1 2.4 1.4z" data-name="Bosnia and Herzegovina"/>
          <path class="country" d="M1141.6 162.7l-3.9-0.2-0.8 0.6 1.5 2 2 4-4.1 0.3-1.3 1.4 0.3 3.1-2.1-0.6-4.3 0.3-1.5-1.5-1.7 1.1-1.9-0.9-3.9-0.1-5.7-1.5-4.9-0.5-3.8 0.2-2.4 1.6-2.3 0.3-0.5-2.8-1.9-2.8 2.8-1.3-0.4-2.4-1.7-2.3-0.6-2.7 4.7 0 4.8-2.3 0.5-3.4 3.6-2-1-2.7 2.7-1 4.6-2.3 5.3 1.5 0.9 1.5 2.4-0.7 4.8 1.4 1.1 2.9-0.7 1.6 3.8 4 2.1 1.1 0 1.1 3.4 1.1 1.7 1.6-1.6 1.3z" data-name="Belarus"/>
          <text x="1000" y="500" text-anchor="middle" fill="#666" font-family="Arial, sans-serif" font-size="24">Interactive World Map</text>
        </svg>
      `;
      
      this.mapRef.current.innerHTML = svgContent;
      
      // Add event listeners to countries
      const countries = this.mapRef.current.querySelectorAll('.country');
      countries.forEach(country => {
        country.addEventListener('mouseenter', () => {
          const countryName = country.getAttribute('data-name');
          this.setState({ hoveredCountry: countryName });
        });
        
        country.addEventListener('mouseleave', () => {
          this.setState({ hoveredCountry: null });
        });

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
    }
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
