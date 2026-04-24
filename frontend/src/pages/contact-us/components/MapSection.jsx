import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
            Visit Our Office
          </h2>
          <p className="text-lg text-muted-foreground">
            Located in the heart of Gujarat's agricultural hub, our office is easily accessible 
            and open for in-person consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map Placeholder */}
          <div className="relative">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="MapPin" size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Interactive Map
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AgroLand Portal Office<br />
                    Gandhinagar, Gujarat
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <div className="inline-flex items-center space-x-2">
                        <Icon name="ExternalLink" size={16} />
                        <span>View on Google Maps</span>
                      </div>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                Location Details
              </h3>
              <p className="text-muted-foreground">
                Our office is strategically located in Gandhinagar, providing easy access 
                to farmers and agricultural businesses across Gujarat.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Icon name="MapPin" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Full Address</h4>
                  <p className="text-sm text-muted-foreground">
                    AgroLand Portal Pvt. Ltd.<br />
                    123 Agriculture Hub, Sector 15<br />
                    Gandhinagar, Gujarat 382015<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Icon name="Car" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Parking</h4>
                  <p className="text-sm text-muted-foreground">
                    Free parking available on-site. Easy access for cars and two-wheelers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Icon name="Bus" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Public Transport</h4>
                  <p className="text-sm text-muted-foreground">
                    Well-connected by GSRTC buses. Nearest bus stop: Agriculture Hub (2 min walk).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Icon name="Clock" size={20} className="text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground">Visit Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-3">
                Planning a Visit?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                We recommend scheduling an appointment to ensure our team can provide 
                you with dedicated attention and support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href="tel:+918200072638">
                    <div className="inline-flex items-center space-x-2">
                      <Icon name="Phone" size={16} />
                      <span>Call to Schedule</span>
                    </div>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href="mailto:info@agrolandportal.com">
                    <div className="inline-flex items-center space-x-2">
                      <Icon name="Mail" size={16} />
                      <span>Email Us</span>
                    </div>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;