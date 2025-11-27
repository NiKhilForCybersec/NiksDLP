/**
 * DLP Documentation - Interactive Components
 * Handles: Sidebar navigation, tabs, accordions, code copy, search
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTabs();
  initAccordions();
  initCodeCopy();
  initSearch();
  initSmoothScroll();
  highlightCurrentNav();
});

/* ═══════════════════════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (!menuBtn || !sidebar) return;
  
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('open');
    
    // Update aria
    const isOpen = sidebar.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
  });
  
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
  
  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      overlay?.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════
   TABS
   ═══════════════════════════════════════════════════════════════════ */
function initTabs() {
  const tabContainers = document.querySelectorAll('.tabs');
  
  tabContainers.forEach(container => {
    const buttons = container.querySelectorAll('.tab-button');
    const panels = container.querySelectorAll('.tab-panel');
    
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Remove active from all
        buttons.forEach(btn => btn.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
        
        // Add active to clicked
        button.classList.add('active');
        panels[index]?.classList.add('active');
        
        // Update aria
        button.setAttribute('aria-selected', 'true');
        buttons.forEach((btn, i) => {
          if (i !== index) {
            btn.setAttribute('aria-selected', 'false');
          }
        });
      });
      
      // Keyboard navigation
      button.addEventListener('keydown', (e) => {
        let targetIndex;
        
        if (e.key === 'ArrowRight') {
          targetIndex = (index + 1) % buttons.length;
        } else if (e.key === 'ArrowLeft') {
          targetIndex = (index - 1 + buttons.length) % buttons.length;
        } else if (e.key === 'Home') {
          targetIndex = 0;
        } else if (e.key === 'End') {
          targetIndex = buttons.length - 1;
        }
        
        if (targetIndex !== undefined) {
          e.preventDefault();
          buttons[targetIndex].click();
          buttons[targetIndex].focus();
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   ACCORDIONS
   ═══════════════════════════════════════════════════════════════════ */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion-item');
    
    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      
      header?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items in this accordion (optional: remove for multi-open)
        // items.forEach(i => i.classList.remove('active'));
        
        // Toggle clicked item
        if (isActive) {
          item.classList.remove('active');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
      
      // Keyboard support
      header?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   CODE COPY
   ═══════════════════════════════════════════════════════════════════ */
function initCodeCopy() {
  const copyButtons = document.querySelectorAll('.code-copy');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const codeBlock = button.closest('.code-block');
      const code = codeBlock?.querySelector('pre code, pre')?.textContent;
      
      if (!code) return;
      
      try {
        await navigator.clipboard.writeText(code);
        
        // Update button state
        const originalHTML = button.innerHTML;
        button.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        button.classList.add('copied');
        
        // Reset after delay
        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed';
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   SEARCH (SIDEBAR)
   ═══════════════════════════════════════════════════════════════════ */
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    navLinks.forEach(link => {
      const text = link.textContent.toLowerCase();
      const section = link.closest('.nav-section');
      
      if (query === '' || text.includes(query)) {
        link.style.display = '';
      } else {
        link.style.display = 'none';
      }
    });
    
    // Show/hide section titles based on visible links
    const sections = document.querySelectorAll('.nav-section');
    sections.forEach(section => {
      const visibleLinks = section.querySelectorAll('.nav-link:not([style*="display: none"])');
      const title = section.querySelector('.nav-section-title');
      
      if (visibleLinks.length === 0) {
        if (title) title.style.display = 'none';
      } else {
        if (title) title.style.display = '';
      }
    });
  });
  
  // Keyboard shortcut to focus search (Ctrl/Cmd + K)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════
   SMOOTH SCROLL
   ═══════════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without scrolling
        history.pushState(null, null, href);
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   HIGHLIGHT CURRENT NAV
   ═══════════════════════════════════════════════════════════════════ */
function highlightCurrentNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace('./', ''))) {
      link.classList.add('active');
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHTING (BASIC)
   ═══════════════════════════════════════════════════════════════════ */
function highlightSyntax(code, language) {
  // Basic syntax highlighting patterns
  const patterns = {
    powershell: [
      { regex: /#.*/g, class: 'comment' },
      { regex: /\b(Get|Set|New|Remove|Import|Export|Invoke|Start|Stop|Test|Write|Read|Add|Clear|Copy|Move|Select|Where|ForEach|If|Else|ElseIf|Switch|While|Do|For|Try|Catch|Finally|Return|Break|Continue|Function|Param)\b/gi, class: 'keyword' },
      { regex: /"[^"]*"|'[^']*'/g, class: 'string' },
      { regex: /\$[\w]+/g, class: 'variable' },
      { regex: /\b\d+\b/g, class: 'number' },
    ],
    sql: [
      { regex: /--.*$/gm, class: 'comment' },
      { regex: /\b(SELECT|FROM|WHERE|AND|OR|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|IN|NOT|NULL|IS|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MAX|MIN)\b/gi, class: 'keyword' },
      { regex: /'[^']*'/g, class: 'string' },
      { regex: /\b\d+\b/g, class: 'number' },
    ],
    kql: [
      { regex: /\/\/.*/g, class: 'comment' },
      { regex: /\b(let|where|project|extend|summarize|by|join|on|union|sort|top|take|count|render|search|parse|mv-expand|evaluate|datatable|print|range|ago|now|datetime|timespan|between|contains|startswith|endswith|matches|regex|in|has|has_any|has_all|isempty|isnotempty|isnull|isnotnull|case|iff|coalesce|strcat|split|substring|strlen|toupper|tolower|trim|replace|extract|tostring|toint|tolong|todouble|tobool|todatetime|totimespan|bin|floor|ceiling|round|abs|log|log10|exp|pow|sqrt|sign|min|max|sum|avg|count|dcount|percentile|stdev|variance|make_list|make_set|arg_max|arg_min)\b/gi, class: 'keyword' },
      { regex: /"[^"]*"|'[^']*'/g, class: 'string' },
      { regex: /\b\d+[dhms]?\b/g, class: 'number' },
    ],
    bash: [
      { regex: /#.*/g, class: 'comment' },
      { regex: /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|echo|read|export|source|alias|cd|ls|mv|cp|rm|mkdir|chmod|chown|grep|awk|sed|cat|head|tail|find|xargs|curl|wget)\b/g, class: 'keyword' },
      { regex: /"[^"]*"|'[^']*'/g, class: 'string' },
      { regex: /\$[\w{}]+/g, class: 'variable' },
    ],
    json: [
      { regex: /"[^"]*"(?=\s*:)/g, class: 'variable' },
      { regex: /"[^"]*"/g, class: 'string' },
      { regex: /\b(true|false|null)\b/g, class: 'keyword' },
      { regex: /\b-?\d+\.?\d*\b/g, class: 'number' },
    ],
    xml: [
      { regex: /&lt;!--[\s\S]*?--&gt;/g, class: 'comment' },
      { regex: /&lt;\/?[\w-]+/g, class: 'keyword' },
      { regex: /[\w-]+(?==)/g, class: 'variable' },
      { regex: /"[^"]*"/g, class: 'string' },
      { regex: /&gt;/g, class: 'keyword' },
    ]
  };
  
  const langPatterns = patterns[language.toLowerCase()];
  if (!langPatterns) return code;
  
  let highlighted = code;
  
  // Escape HTML first
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Apply patterns
  langPatterns.forEach(({ regex, class: className }) => {
    highlighted = highlighted.replace(regex, match => 
      `<span class="${className}">${match}</span>`
    );
  });
  
  return highlighted;
}

// Apply syntax highlighting to code blocks
document.querySelectorAll('.code-block[data-language]').forEach(block => {
  const language = block.dataset.language;
  const codeEl = block.querySelector('pre code, pre');
  
  if (codeEl) {
    codeEl.innerHTML = highlightSyntax(codeEl.textContent, language);
  }
});

/* ═══════════════════════════════════════════════════════════════════
   TABLE OF CONTENTS GENERATION
   ═══════════════════════════════════════════════════════════════════ */
function generateTOC(containerSelector = '.content-wrapper', tocSelector = '.toc') {
  const container = document.querySelector(containerSelector);
  const toc = document.querySelector(tocSelector);
  
  if (!container || !toc) return;
  
  const headings = container.querySelectorAll('h2, h3');
  
  if (headings.length === 0) {
    toc.style.display = 'none';
    return;
  }
  
  const list = document.createElement('ul');
  
  headings.forEach((heading, index) => {
    // Add ID if not present
    if (!heading.id) {
      heading.id = `section-${index}`;
    }
    
    const li = document.createElement('li');
    const a = document.createElement('a');
    
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    
    if (heading.tagName === 'H3') {
      li.style.paddingLeft = '1rem';
    }
    
    li.appendChild(a);
    list.appendChild(li);
  });
  
  toc.appendChild(list);
}

/* ═══════════════════════════════════════════════════════════════════
   SCROLL SPY (FOR TOC)
   ═══════════════════════════════════════════════════════════════════ */
function initScrollSpy() {
  const headings = document.querySelectorAll('h2[id], h3[id]');
  const tocLinks = document.querySelectorAll('.toc a');
  
  if (headings.length === 0 || tocLinks.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -80% 0px'
  });
  
  headings.forEach(heading => observer.observe(heading));
}

/* ═══════════════════════════════════════════════════════════════════
   DARK/LIGHT MODE TOGGLE (Future enhancement)
   ═══════════════════════════════════════════════════════════════════ */
function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════════ */

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get path depth for relative links
function getPathDepth() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s && !s.includes('.'));
  return segments.length;
}

// Adjust relative links based on current page depth
function adjustRelativeLinks() {
  const depth = getPathDepth();
  const prefix = ''.repeat(depth);
  
  document.querySelectorAll('a[href^="./"]').forEach(link => {
    const href = link.getAttribute('href');
    link.setAttribute('href', prefix + href.slice(2));
  });
}
