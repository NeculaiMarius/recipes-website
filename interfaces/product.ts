export interface Product {
  _id: string
  _keywords: string[]
  added_countries_tags: string[]
  additives_n: number
  additives_original_tags: string[]
  additives_tags: string[]
  allergens: string
  allergens_from_ingredients: string
  allergens_from_user: string
  allergens_hierarchy: string[]
  allergens_lc: string
  allergens_tags: string[]
  amino_acids_prev_tags: string[]
  amino_acids_tags: string[]
  brands: string
  brands_tags: string[]
  categories: string
  categories_hierarchy: string[]
  categories_lc: string
  categories_old: string
  categories_properties: {
    [key: string]: string
  }
  categories_properties_tags: string[]
  categories_tags: string[]
  category_properties: Record<string, unknown>
  checkers: string[]
  checkers_tags: string[]
  ciqual_food_name_tags: string[]
  cities_tags: string[]
  code: string
  codes_tags: string[]
  compared_to_category: string
  complete: number
  completed_t: number
  completeness: number
  correctors: string[]
  correctors_tags: string[]
  countries: string
  countries_beforescanbot: string
  countries_hierarchy: string[]
  countries_lc: string
  countries_tags: string[]
  created_t: number
  creator: string
  data_quality_bugs_tags: string[]
  data_quality_errors_tags: string[]
  data_quality_info_tags: string[]
  data_quality_tags: string[]
  data_quality_warnings_tags: string[]
  data_sources: string
  data_sources_tags: string[]
  debug_param_sorted_langs: string[]
  ecoscore_data: {
    adjustments: {
      origins_of_ingredients: {
        aggregated_origins: Array<{
          epi_score: string
          origin: string
          percent: number
          transportation_score: number
        }>
        epi_score: number
        epi_value: number
        origins_from_categories: string[]
        origins_from_origins_field: string[]
        transportation_score: number
        transportation_scores: Record<string, number>
        transportation_value: number
        transportation_values: Record<string, number>
        value: number
        values: Record<string, number>
      }
      packaging: {
        non_recyclable_and_non_biodegradable_materials: number
        packagings: Array<{
          environmental_score_material_score: number
          environmental_score_shape_ratio: number
          material: string
          non_recyclable_and_non_biodegradable: string
          number_of_units: number
          quantity_per_unit: string
          quantity_per_unit_unit: string
          quantity_per_unit_value: number
          recycling: string
          shape: string
        }>
        score: number
        value: number
      }
      production_system: {
        labels: string[]
        value: number
        warning: string
      }
      threatened_species: Record<string, unknown>
    }
    agribalyse: {
      agribalyse_food_code: string
      co2_agriculture: number
      co2_consumption: number
      co2_distribution: number
      co2_packaging: number
      co2_processing: number
      co2_total: number
      co2_transportation: number
      code: string
      dqr: string
      ef_agriculture: number
      ef_consumption: number
      ef_distribution: number
      ef_packaging: number
      ef_processing: number
      ef_total: number
      ef_transportation: number
      is_beverage: number
      name_en: string
      name_fr: string
      score: number
      version: string
    }
    grade: string
    grades: Record<string, string>
    missing: {
      labels: number
    }
    missing_data_warning: number
    score: number
    scores: Record<string, number>
    status: string
  }
  ecoscore_grade: string
  ecoscore_score: number
  ecoscore_tags: string[]
  editors: string[]
  editors_tags: string[]
  emb_codes: string
  emb_codes_20141016: string
  emb_codes_orig: string
  emb_codes_tags: string[]
  entry_dates_tags: string[]
  environment_impact_level: string
  environment_impact_level_tags: string[]
  expiration_date: string
  food_groups: string
  food_groups_tags: string[]
  fruits_vegetables_nuts_100g_estimate: number
  generic_name: string
  generic_name_de: string
  generic_name_en: string
  generic_name_fr: string
  generic_name_nl: string
  generic_name_xx: string
  image_front_small_url: string
  image_front_thumb_url: string
  image_front_url: string
  image_ingredients_small_url: string
  image_ingredients_thumb_url: string
  image_ingredients_url: string
  image_nutrition_small_url: string
  image_nutrition_thumb_url: string
  image_nutrition_url: string
  image_packaging_small_url: string
  image_packaging_thumb_url: string
  image_packaging_url: string
  image_small_url: string
  image_thumb_url: string
  image_url: string
  images: {
    [key: string]: {
      sizes: {
        [size: string]: {
          h: number
          w: number
        }
      }
      uploaded_t: number | string
      uploader: string
    }
  } & {
    front: {
      geometry: string
      imgid: string
      normalize: null | string
      rev: string
      sizes: {
        [size: string]: {
          h: number
          w: number
        }
      }
      white_magic: null | string
    }
    // ... other image types with similar structure
  }
  informers: string[]
  informers_tags: string[]
  ingredients: Array<{
    ciqual_proxy_food_code?: string
    ecobalyse_code?: string
    id: string
    is_in_taxonomy: number
    percent_estimate?: number
    percent_max?: number
    percent_min?: number
    rank?: number
    text: string
    vegan?: string
    vegetarian?: string
    from_palm_oil?: string
    has_sub_ingredients?: string
  }>
  ingredients_analysis: {
    [key: string]: string[]
  }
  ingredients_analysis_tags: string[]
  ingredients_debug: Array<string | null>
  ingredients_from_or_that_may_be_from_palm_oil_n: number
  ingredients_from_palm_oil_n: number
  ingredients_from_palm_oil_tags: string[]
  ingredients_hierarchy: string[]
  ingredients_ids_debug: string[]
  ingredients_lc: string
  ingredients_n: number
  ingredients_n_tags: string[]
  ingredients_non_nutritive_sweeteners_n: number
  ingredients_original_tags: string[]
  ingredients_percent_analysis: number
  ingredients_sweeteners_n: number
  ingredients_tags: string[]
  ingredients_text: string
  ingredients_text_de: string
  ingredients_text_debug: string
  ingredients_text_en: string
  ingredients_text_fr: string
  ingredients_text_nl: string
  ingredients_text_with_allergens: string
  ingredients_text_with_allergens_de: string
  ingredients_text_with_allergens_en: string
  ingredients_text_with_allergens_fr: string
  ingredients_text_with_allergens_nl: string
  ingredients_text_xx: string
  ingredients_that_may_be_from_palm_oil_n: number
  ingredients_that_may_be_from_palm_oil_tags: string[]
  ingredients_with_specified_percent_n: number
  ingredients_with_specified_percent_sum: number
  ingredients_with_unspecified_percent_n: number
  ingredients_with_unspecified_percent_sum: number
  ingredients_without_ciqual_codes: string[]
  ingredients_without_ciqual_codes_n: number
  ingredients_without_ecobalyse_ids: string[]
  ingredients_without_ecobalyse_ids_n: number
  interface_version_modified: string
  known_ingredients_n: number
  labels: string
  labels_hierarchy: string[]
  labels_lc: string
  labels_old: string
  labels_tags: string[]
  lang: string
  languages: {
    [key: string]: number
  }
  languages_codes: {
    [key: string]: number
  }
  languages_hierarchy: string[]
  languages_tags: string[]
  last_edit_dates_tags: string[]
  last_editor: string
  last_image_dates_tags: string[]
  last_image_t: number
  last_modified_by: string
  last_modified_t: number
  last_updated_t: number
  lc: string
  link: string
  main_countries_tags: string[]
  manufacturing_places: string
  manufacturing_places_tags: string[]
  max_imgid: string
  minerals_prev_tags: string[]
  minerals_tags: string[]
  misc_tags: string[]
  no_nutrition_data: string
  not_names_tags: string[]
  nova_group: number
  nova_group_debug: string
  nova_groups: string
  nova_groups_markers: {
    [key: string]: Array<[string, string]>
  }
  nova_groups_tags: string[]
  nucleotides_prev_tags: string[]
  nucleotides_tags: string[]
  nutrient_levels: {
    fat: string
    salt: string
    saturated_fat: string
    sugars: string
  }
  nutrient_levels_tags: string[]
  nutriments: {
    [key: string]: number | string
  }
  nutriments_estimated: {
    [key: string]: number
  }
  nutriscore: {
    [year: string]: {
      category_available: number
      data: string // Could be further typed
      grade: string
      nutrients_available: number
      nutriscore_applicable: number
      nutriscore_computed: number
      score: number
    }
  }
  nutriscore_2021_tags: string[]
  nutriscore_2023_tags: string[]
  nutriscore_data: string // Could be further typed
  nutriscore_grade: string
  nutriscore_score: number
  nutriscore_score_opposite: number
  nutriscore_tags: string[]
  nutriscore_version: string
  nutrition_data: string
  nutrition_data_per: string
  nutrition_data_prepared: string
  nutrition_data_prepared_per: string
  nutrition_grade_fr: string
  nutrition_grades: string
  nutrition_grades_tags: string[]
  nutrition_score_beverage: number
  nutrition_score_debug: string
  nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients: number
  nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients_value: number
  nutrition_score_warning_fruits_vegetables_nuts_estimate: number
  obsolete: string
  obsolete_since_date: string
  origin: string
  origin_de: string
  origin_en: string
  origin_fr: string
  origin_nl: string
  origins: string
  origins_hierarchy: string[]
  origins_lc: string
  origins_old: string
  origins_tags: string[]
  other_nutritional_substances_tags: string[]
  packaging: string
  packaging_hierarchy: string[]
  packaging_lc: string
  packaging_materials_tags: string[]
  packaging_old: string
  packaging_old_before_taxonomization: string
  packaging_recycling_tags: string[]
  packaging_shapes_tags: string[]
  packaging_tags: string[]
  packaging_text: string
  packaging_text_de: string
  packaging_text_en: string
  packaging_text_fr: string
  packaging_text_nl: string
  packaging_text_xx: string
  packagings: Array<{
    material: string
    number_of_units: number
    quantity_per_unit: string
    quantity_per_unit_unit: string
    quantity_per_unit_value: number
    recycling: string
    shape: string
  }>
  packagings_complete: number
  packagings_n: number
  photographers: string[]
  photographers_tags: string[]
  pnns_groups_1: string
  pnns_groups_1_tags: string[]
  pnns_groups_2: string
  pnns_groups_2_tags: string[]
  popularity_key: number
  popularity_tags: string[]
  product_name: string
  product_name_de: string
  product_name_en: string
  product_name_fr: string
  product_name_nl: string
  product_name_xx: string
  product_quantity: string
  product_quantity_unit: string
  product_type: string
  purchase_places: string
  purchase_places_tags: string[]
  quantity: string
  removed_countries_tags: string[]
  rev: number
  scans_n: number
  selected_images: {
    [category: string]: {
      [size: string]: {
        [lang: string]: string
      }
    }
  }
  serving_quantity: number
  serving_quantity_unit: string
  serving_size: string
  sortkey: number
  states: string
  states_hierarchy: string[]
  states_tags: string[]
  stores: string
  stores_tags: string[]
  teams: string
  teams_tags: string[]
  traces: string
  traces_from_ingredients: string
  traces_from_user: string
  traces_hierarchy: string[]
  traces_lc: string
  traces_tags: string[]
  unique_scans_n: number
  unknown_ingredients_n: number
  unknown_nutrients_tags: string[]
  update_key: string
  vitamins_prev_tags: string[]
  vitamins_tags: string[]
  weighers_tags: string[]
  weighters_tags: string[]
}

export interface SearchProduct {
  code: string
  product_name: string
  brands: string
  image_url: string
  nutriscore_grade: string
  ecoscore_grade: string
  categories: string
}