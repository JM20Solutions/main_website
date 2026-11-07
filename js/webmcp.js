(() => {
  "use strict";

  const isSpanish = (document.documentElement.lang || "es")
    .toLowerCase()
    .startsWith("es");

  const services = isSpanish
    ? [
        {
          id: "missed-opportunities",
          name: "Oportunidades de venta perdidas",
          description:
            "Organizar llamadas, mensajes y solicitudes en un sistema; responder inicialmente y automatizar el seguimiento de presupuestos."
        },
        {
          id: "customer-retention",
          name: "Retención de clientes",
          description:
            "Organizar el historial de clientes, detectar clientes inactivos y facilitar recordatorios y comunicaciones personalizadas."
        },
        {
          id: "payments",
          name: "Facturas y cobros",
          description:
            "Automatizar recordatorios de vencimiento, seguimiento de facturas y avisos de pagos pendientes."
        },
        {
          id: "repetitive-work",
          name: "Trabajo repetitivo",
          description:
            "Conectar herramientas y automatizar tareas administrativas y procesos documentales."
        },
        {
          id: "capacity",
          name: "Citas y capacidad",
          description:
            "Mejorar la gestión de agendas mediante confirmaciones, recordatorios y coordinación de citas."
        },
        {
          id: "profitability",
          name: "Rentabilidad",
          description:
            "Centralizar datos de ventas y costes, analizar márgenes e identificar trabajos menos rentables."
        }
      ]
    : [
        {
          id: "missed-opportunities",
          name: "Missed sales opportunities",
          description:
            "Organise calls, messages and enquiries in one system; provide initial responses and automate quote follow-ups."
        },
        {
          id: "customer-retention",
          name: "Customer retention",
          description:
            "Organise customer history, identify inactive customers and support reminders and personalised communication."
        },
        {
          id: "payments",
          name: "Invoices and payments",
          description:
            "Automate due-date reminders, invoice follow-ups and notifications about overdue payments."
        },
        {
          id: "repetitive-work",
          name: "Repetitive work",
          description:
            "Connect tools and automate administrative tasks and document workflows."
        },
        {
          id: "capacity",
          name: "Appointments and capacity",
          description:
            "Improve calendar management with confirmations, reminders and appointment coordination."
        },
        {
          id: "profitability",
          name: "Profitability",
          description:
            "Centralise sales and cost data, analyse margins and identify less profitable work."
        }
      ];

  const caseStudies = [
    {
      name: "Noah",
      url: "https://noah.jm20aisolutions.com/",
      description: isSpanish
        ? "Demostración de Noah."
        : "Noah demonstration."
    },
    {
      name: "Murph",
      url: "https://murph.jm20aisolutions.com/",
      description: isSpanish
        ? "Demostración de Murph y su ecosistema."
        : "Murph and its ecosystem demonstration.",
      related: ["Mowaat", "Iggy", "Sheetah"]
    }
  ];

  const businessInfo = isSpanish
    ? {
        name: "JM20",
        website: "https://jm20aisolutions.com/",
        positioning:
          "JM20 ayuda a las empresas a identificar dónde pierden dinero, calcular el coste de esas pérdidas y desarrollar soluciones para reducirlas.",
        approach:
          "Primero se entiende el problema del negocio. Después se identifica la solución adecuada. La inteligencia artificial y la automatización son herramientas utilizadas cuando aportan valor.",
        contact:
          "El formulario de contacto de la web permite solicitar un análisis del negocio."
      }
    : {
        name: "JM20",
        website: "https://jm20aisolutions.com/en/",
        positioning:
          "JM20 helps businesses identify where they are losing money, calculate the cost of those losses and develop solutions to reduce them.",
        approach:
          "First, the business problem is understood. Then the appropriate solution is identified. AI and automation are tools used when they add value.",
        contact:
          "The website contact form can be used to request a business analysis."
      };

  function round2(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  function calculateLosses(input = {}) {
    const defaults = {
      unanswered_calls_per_week: 8,
      call_conversion_rate_percent: 40,
      average_sale_eur: 30,

      quotes_not_followed_up_per_month: 10,
      quote_acceptance_rate_percent: 20,
      average_quote_value_eur: 400,

      no_shows_per_month: 12,
      recoverable_no_shows_percent: 50,
      appointment_price_eur: 25,

      repetitive_hours_per_week: 6,
      automation_rate_percent: 60,
      hourly_cost_eur: 15
    };

    const values = {};
    const defaultedFields = [];
    const errors = [];

    for (const [key, fallback] of Object.entries(defaults)) {
      const supplied = input[key];
      if (supplied === undefined) defaultedFields.push(key);
      const value = supplied === undefined ? fallback : Number(supplied);

      if (!Number.isFinite(value) || value < 0) {
        errors.push(`${key} must be a number of 0 or more (received ${supplied}).`);
      }

      values[key] = value;
    }

    const percentageFields = [
      "call_conversion_rate_percent",
      "quote_acceptance_rate_percent",
      "recoverable_no_shows_percent",
      "automation_rate_percent"
    ];

    for (const key of percentageFields) {
      if (Number.isFinite(values[key]) && values[key] > 100) {
        errors.push(`${key} must be between 0 and 100 (received ${values[key]}).`);
      }
    }

    if (errors.length) {
      return {
        error: errors.join(" "),
        note: "Nothing was calculated. Ask the user for corrected values. Do not invent numbers."
      };
    }

    const calls =
      values.unanswered_calls_per_week *
      4.33 *
      values.call_conversion_rate_percent / 100 *
      values.average_sale_eur;

    const quotes =
      values.quotes_not_followed_up_per_month *
      values.quote_acceptance_rate_percent / 100 *
      values.average_quote_value_eur;

    const appointments =
      values.no_shows_per_month *
      values.recoverable_no_shows_percent / 100 *
      values.appointment_price_eur;

    const repetitiveWork =
      values.repetitive_hours_per_week *
      4.33 *
      values.automation_rate_percent / 100 *
      values.hourly_cost_eur;

    const monthlyTotal = calls + quotes + appointments + repetitiveWork;

    const nothingSupplied = defaultedFields.length === Object.keys(defaults).length;

    return {
      currency: "EUR",
      basis: nothingSupplied
        ? (isSpanish
            ? "Estimación con valores de ejemplo de la web. No se han proporcionado datos propios. No representa una pérdida verificada."
            : "Estimate using the website's example values only. No figures were supplied. It is not a verified loss.")
        : (isSpanish
            ? "Estimación basada en los datos introducidos. Los campos de defaultedFields usan valores de ejemplo. No representa una pérdida verificada."
            : "Estimate based on the supplied figures. Fields listed in defaultedFields use example values. It is not a verified loss."),
      monthly: {
        unansweredCalls: round2(calls),
        quotesWithoutFollowUp: round2(quotes),
        missedAppointments: round2(appointments),
        repetitiveWork: round2(repetitiveWork),
        total: round2(monthlyTotal)
      },
      annualTotal: round2(monthlyTotal * 12),
      inputsUsed: values,
      defaultedFields,
      usedDefaults: defaultedFields.length > 0
    };
  }

  function fillContactForm(input = {}) {
    const form = document.querySelector("#f");

    if (!form) {
      throw new Error(
        isSpanish
          ? "No se ha encontrado el formulario de contacto en esta página."
          : "The contact form was not found on this page."
      );
    }

    const requiredFields = ["name", "company", "email"];

    for (const key of requiredFields) {
      if (typeof input[key] !== "string" || !input[key].trim()) {
        throw new Error(`${key} is required.`);
      }
    }

    const fieldMap = {
      name: "n",
      company: "c",
      email: "e",
      phone: "p",
      website: "w",
      message: "m"
    };

    for (const [key, fieldName] of Object.entries(fieldMap)) {
      const element = form.elements.namedItem(fieldName);

      if (element && input[key] !== undefined) {
        element.value = String(input[key]);
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    if (input.interest) {
      const interestField = form.elements.namedItem("i");

      if (!interestField) {
        throw new Error("The interest field was not found.");
      }

      const option = Array.from(interestField.options).find(
        item => item.value === input.interest
      );

      if (!option) {
        throw new Error(
          "Invalid interest value. Use one of the supported values."
        );
      }

      interestField.value = input.interest;
      interestField.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // Deliberately do not check the consent box or submit the form.
    const consent = form.elements.namedItem("k");
    if (consent) consent.checked = false;

    form.scrollIntoView({ behavior: "smooth", block: "center" });

    const firstField = form.elements.namedItem("n");
    if (firstField) firstField.focus({ preventScroll: true });

    return {
      success: true,
      message: isSpanish
        ? "El formulario se ha rellenado. Revisa los datos, marca la casilla de consentimiento si estás de acuerdo y envía el formulario manualmente. No se ha enviado ninguna información."
        : "The form has been filled in. Review the details, tick the consent box if you agree, and submit the form manually. No information has been sent."
    };
  }

  const numberProperty = description => ({
    type: "number",
    minimum: 0,
    description
  });

  const tools = [
    {
      name: "get_business_info",
      description: isSpanish
        ? "Obtiene información general sobre JM20, su enfoque y su propuesta de valor."
        : "Returns general information about JM20, its approach and value proposition.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      annotations: { readOnlyHint: true },
      execute: async () => businessInfo
    },

    {
      name: "get_services",
      description: isSpanish
        ? "Devuelve las seis áreas de problemas empresariales que JM20 ayuda a abordar."
        : "Returns the six business problem areas JM20 helps address.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      annotations: { readOnlyHint: true },
      execute: async () => services
    },

    {
      name: "get_case_studies",
      description: isSpanish
        ? "Devuelve las demostraciones públicas de Noah y Murph y sus enlaces."
        : "Returns the public Noah and Murph demonstrations and their links.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      annotations: { readOnlyHint: true },
      execute: async () => caseStudies
    },

    {
      name: "calculate_business_losses",
      description: isSpanish
        ? "Calcula una estimación de pérdidas mensuales y anuales usando las cuatro fórmulas de la calculadora de JM20. Los campos omitidos usan los valores de ejemplo de la web."
        : "Estimates monthly and annual business losses using the four formulas from the JM20 website calculator. Omitted fields use the website's example values.",
      inputSchema: {
        type: "object",
        properties: {
          unanswered_calls_per_week: numberProperty("Unanswered calls or messages per week."),
          call_conversion_rate_percent: numberProperty("Estimated percentage that would have bought. Maximum 100."),
          average_sale_eur: numberProperty("Average sale value in EUR."),

          quotes_not_followed_up_per_month: numberProperty("Quotes not followed up per month."),
          quote_acceptance_rate_percent: numberProperty("Estimated quote acceptance percentage. Maximum 100."),
          average_quote_value_eur: numberProperty("Average quote value in EUR."),

          no_shows_per_month: numberProperty("Missed appointments per month."),
          recoverable_no_shows_percent: numberProperty("Percentage that could be prevented or refilled. Maximum 100."),
          appointment_price_eur: numberProperty("Price per appointment in EUR."),

          repetitive_hours_per_week: numberProperty("Hours of repetitive work per week."),
          automation_rate_percent: numberProperty("Percentage of that work that could be automated. Maximum 100."),
          hourly_cost_eur: numberProperty("Cost per working hour in EUR.")
        }
      },
      annotations: { readOnlyHint: true },
      execute: async input => calculateLosses(input)
    },

    {
      name: "contact_jm20",
      description: isSpanish
        ? "Rellena el formulario de contacto de JM20 para que el visitante lo revise. No envía el formulario ni transmite datos. El visitante debe revisar, aceptar el consentimiento y enviarlo manualmente."
        : "Fills in the JM20 contact form for the visitor to review. It does not submit the form or transmit data. The visitor must review it, provide consent and submit manually.",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Contact's full name." },
          company: { type: "string", description: "Business name." },
          email: { type: "string", description: "Contact email address." },
          phone: { type: "string", description: "Optional phone number." },
          website: { type: "string", description: "Optional business website." },
          interest: {
            type: "string",
            enum: [
              "Discovery",
              "Missed-opportunities",
              "Customer-retention",
              "Payments",
              "Repetitive-work",
              "Capacity",
              "Profitability",
              "Other"
            ],
            description: "The contact form's interest category."
          },
          message: {
            type: "string",
            description: "Description of the business and the problem to solve."
          }
        },
        required: ["name", "company", "email"]
      },
      annotations: {
        readOnlyHint: false,
        consequentialHint: false
      },
      execute: async input => fillContactForm(input)
    }
  ];

  async function registerTools() {
    if (
      !document.modelContext ||
      typeof document.modelContext.registerTool !== "function"
    ) {
      console.info(
        "JM20 WebMCP: document.modelContext is not available in this browser."
      );
      return;
    }

    for (const tool of tools) {
      await document.modelContext.registerTool(tool);
    }

    console.info(
      `JM20 WebMCP: registered ${tools.length} tools.`
    );
  }

  registerTools().catch(error => {
    console.error("JM20 WebMCP registration failed:", error);
  });
})();
