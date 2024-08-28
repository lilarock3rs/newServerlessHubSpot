{% set servicePlanListings = crm_objects("product", "limit=200&type=service-plan", "name, variant_order, variant, fr_featured_subscription_text, featured_subscription_text, stripe_id, price_id, hs_images, recurringbillingfrequency, hs_object_id, description, description_fr, in_stock, type, hs_sku, primary_sku, price, productname_fr") %}


<!-- Set Current Product SKU -->
{% set searchPrimarySku = 'limit=200&primary_sku=loyalty_ExSP' + '&type=service-plan' %}
<!-- CRM Call to pull Only Variants of Current Product -->
{% set variantSubscriptionListings = crm_objects("product", searchPrimarySku, "name, productname_fr, variant, fr_featured_subscription_text, featured_subscription_text, customer_chooses_price, variant_order, price_id, stripe_id, hs_images, hs_object_id, recurringbillingfrequency, description, in_stock, hs_sku, primary_sku, price, emblem_size, size, color, engraving_line_1_length, engraving_line_2_length, engraving_line_3_length, engraving_line_4_length, engraving_line_5_length") %}
<!-- Script to Setup Variants -->
<script>
  var primarySku = 'loyalty_ExSP';
  // HOLDS ALL VARIANTS OF CURRENT PAGE
  if (!variantSku) {
    var variantSku = []
    }

  {% for row in variantSubscriptionListings.results %}
  {% if row.variant == 'Yes' %}
  var currentSku = '{{ row.primary_sku }}';
  if (currentSku == primarySku) {
    // ADDS ALL VARIANTS OF CURRENT PAGE TO VARIABLE
    variantSku.push({
    name: "{{ row.name }}", productname_fr: "{{ row.productname_fr }}", type: '{{ row.type }}', sku: '{{ row.hs_sku }}', customer_chooses_price: '{{ row.customer_chooses_price }}', price: '{{ row.price }}', price_id: '{{ row.price_id }}', stripe_id: '{{ row.stripe_id }}', size: '{{ row.size|lower|replace('"','') }}', emblem_size:'{{ row.emblem_size }}', color:'{{ row.color }}', stock:'{{ row.in_stock }}' } );              
    }
    console.log('testing', variantSku);
    {% endif %}
    {% endfor %}
</script>
<section id="service-plan-post">
  <div id="medicalert-loader" class="medicalert-loader">
    <div>
      <div class="medicalert-loader-circle"></div>
    </div>
  </div>
  <div>
    <div>{% inline_rich_text field="subscription_plan_content" value="{{ module.subscription_plan_content }}" %}</div>
    <form id="service_plan_post_inside" class="service-plan-post-inside">
      <div>
        {% if contact.province != 'Quebec' %}

        {% for row in servicePlanListings.results %}
        {% if row.variant == 'Yes' and row.primary_sku == 'loyalty_ExSP' %}
        <div class="service-plan-post-block" data-order="{{ row.variant_order }}">
          <div> 
            <label for="loop-item-{{ loop.index }}">
              <div class="service-plan-price">{{ row.price }}</div>
              <div class="service-plan-label">{% if content.language.languageTag == "en" || group.language.languageTag == "en" %}{{ row.name }}{% endif %}{% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}{{ row.productname_fr }}{% endif %}</div>
              <div class="service-plan-text">{% if content.language.languageTag == "en" || group.language.languageTag == "en" %}{{ row.description }}{% endif %}{% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}{{ row.description_fr }}{% endif %}</div>
            </label>
            <input class="input-pricing" type="radio" id="{{ row.price_id }}" name="pricing" value="loop-item-{{ loop.index }}">
            {% if row.featured_subscription_text or row.fr_featured_subscription_text %}
            <div class="service-plan-featured-text">
              <div>
                {% if content.language.languageTag == "en" || group.language.languageTag == "en" %}{{ row.featured_subscription_text }}{% endif %}
                {% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}{{ row.fr_featured_subscription_text }}{% endif %}
              </div>
            </div>
            {% endif %}
          </div>
        </div>
        {% endif %}
        {% endfor %}

        {% endif %}
        {% if contact.province == 'Quebec' %}

        {% for row in servicePlanListings.results %}
        {% if row.variant == 'Yes' and 'loyalty_ExSP' == row.primary_sku and row.recurringbillingfrequency == 'Monthly' %}
        <div class="service-plan-post-block" data-order="{{ row.variant_order }}">
          <div> 
            <label for="loop-item-{{ loop.index }}">
              <div class="service-plan-price">{{ row.price }}</div>
              <div class="service-plan-label">{% if content.language.languageTag == "en" || group.language.languageTag == "en" %}{{ row.name }}{% endif %}{% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}{{ row.productname_fr }}{% endif %}</div>
              <div class="service-plan-text">{% if content.language.languageTag == "en" || group.language.languageTag == "en" %}{{ row.description }}{% endif %}{% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}{{ row.description_fr }}{% endif %}</div>
            </label>
            <input class="input-pricing" type="radio" id="{{ row.price_id }}" name="pricing" value="loop-item-{{ loop.index }}">
          </div>
        </div>
        {% endif %}
        {% endfor %}

        {% endif %}
      </div>

      {% if request_contact.is_logged_in %}
        <div id="product_data" image='' name='' price_id='' price='' type=''>
        </div>
        <div id="language_indicator" language={% if content.language.languageTag=="fr-ca" || group.language.languageTag=="fr-ca" %}'fr'{% else %}'en'{% endif %}></div>
        {{ require_css(get_asset_url('/cms-react-subscribe-button/main.css')) }}
        {{ require_js(get_asset_url('/cms-react-subscribe-button/main.js'), 'footer') }}
        {%- set instance_id = name %}
        <div class="cms-react-subscribe-button">
          <script type="application/json" data-module-instance="{{ instance_id }}" data-portal-id="{{ portalId }}">
              {{ module|tojson }}
          </script>
          <div id="App--{{ instance_id }}"></div>
        </div>
      {% else %}
        <a href="/sign-up" title="Sign Up Today" class="sign-up-cart">
          {% if content.language.languageTag == "en" || group.language.languageTag == "en" %}Sign Up{% endif %}
          {% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}S'abonner{% endif %}
        </a>
        <a href="/client-portal" title="Log In" class="sign-up-cart">
          {% if content.language.languageTag == "en" || group.language.languageTag == "en" %}Login{% endif %}
          {% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}Connexion{% endif %}
        </a>
      {% endif %}
    </form>

  </div>
</section>
<div id="cart-success-modal" class="cart-success-modal">
  <div>
    <div class="add-to-cart-modal-inside">
      <div>
        <div class="modal-exit" id='exit_cart_success'></div>
        <div class="modal-header">
          <div id="cart-success-product-name">{% if content.language.languageTag == "en" || group.language.languageTag == "en" %}{{ dynamic_page_crm_object.name }}{% endif %}{% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}{{ dynamic_page_crm_object.productname_fr }}{% endif %}</div> {% if content.language.languageTag == "en" || group.language.languageTag == "en" %}was successfully added to your cart.{% endif %}{% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %} a été ajouté avec succès à votre panier.{% endif %}</div>
        <a {% if content.language.languageTag == "en" || group.language.languageTag == "en" %}href="/cart" title="Go to Cart"{% endif %}{% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}href="/fr-ca/pannier" title="Pannier"{% endif %}>{% if content.language.languageTag == "en" || group.language.languageTag == "en" %}Take me to my Cart{% endif %}{% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}Emmenez-moi à mon panier{% endif %}</a>
      </div>
    </div>
  </div>
</div>
<div id="renewal-result-modal" class="cart-success-modal">
  <div>
    <div class="add-to-cart-modal-inside">
      <div>
        <div class="modal-exit" id="exit_renewal"></div>
        <div class="modal-header" id="renewal-result-modal-header"></div>
        <div class="modal-button" id="cross-sell-call-to-action">
          <div>
            {% if content.language.languageTag == "en" || group.language.languageTag == "en" %}<a href="https://www.medicalert.ca/products" title="Need a New ID? Check our our Collection">Need a New ID? Check our our Collection</a>{% endif %}
            {% if content.language.languageTag == "en" || group.language.languageTag == "en" %}<a href="https://www.medicalert.ca/donations" title="Interested in making a donation? Make a gift today!">Interested in making a donation? Make a gift today!</a>{% endif %}
            
            {% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}<a href="https://www.medicalert.ca/fr-ca/produits" title="Need a New ID? Check our our Collection">Need a New ID? Check our our Collection</a>{% endif %}
            {% if content.language.languageTag == "fr-ca" || group.language.languageTag == "fr-ca" %}<a href="https://www.medicalert.ca/fr-ca/dons" title="Interested in making a donation? Make a gift today!">Interested in making a donation? Make a gift today!</a>{% endif %}
          </div>
        </div>
    </div>
  </div>
</div>
