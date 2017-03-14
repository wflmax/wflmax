(function (d) {
    d.fn.extend({
        autocomplete: function (a, c) {
            var q = 'string' == typeof a;
            c = d.extend({
            }, d.Autocompleter.defaults, {
                url: q ? a : null,
                data: q ? null : a,
                delay: q ? d.Autocompleter.defaults.delay : 10,
                max: c && !c.scroll ? 10 : 150
            }, c);
            c.highlight = c.highlight || function (a) {
                    return a
                };
            c.formatMatch = c.formatMatch || c.formatItem;
            return this.each(function () {
                new d.Autocompleter(this, c)
            })
        },
        result: function (a) {
            return this.bind('result', a)
        },
        search: function (a) {
            return this.trigger('search', [
                a
            ])
        },
        flushCache: function () {
            return this.trigger('flushCache')
        },
        setOptions: function (a) {
            return this.trigger('setOptions', [
                a
            ])
        },
        unautocomplete: function () {
            return this.trigger('unautocomplete')
        },
        error: function (a) {
            return this.bind('error', a)
        }
    });
    d.Autocompleter = function (a, c) {
        function q() {
            var v = p.selected();
            if (!v) return !1;
            var b = v.result;
            u = b;
            if (c.multiple) {
                var m = s(k.val());
                if (1 < m.length) {
                    var f = c.multipleSeparator.length,
                        g = d(a).selection().start,
                        e,
                        h = 0;
                    d.each(m, function (a, c) {
                        h += c.length;
                        if (g <= h) return e = a,
                            !1;
                        h += f
                    });
                    m[e] = b;
                    b = m.join(c.multipleSeparator)
                }
                b += c.multipleSeparator
            }
            k.val(b);
            n();
            k.trigger('result', [
                v.data,
                v.value
            ]);
            return !0
        }
        function l(a, d) {
            if (m == b.DEL) p.hide();
            else {
                var e = k.val();
                if (d || e != u) u = e,
                    e = h(e),
                    e.length >= c.minChars ? (k.addClass(c.loadingClass), c.matchCase || (e = e.toLowerCase()), f(e, g, n))  : (k.removeClass(c.loadingClass), p.hide(), k.trigger('error', !1))
            }
        }
        function s(a) {
            return a ? c.multiple ? d.map(a.split(c.multipleSeparator), function (c) {
                return d.trim(a).length ? d.trim(c)  : null
            })  : [
                d.trim(a)
            ] : [
                ''
            ]
        }
        function h(b) {
            if (!c.multiple) return b;
            var m = s(b);
            if (1 == m.length) return m[0];
            m =
                d(a).selection().start;
            m = m == b.length ? s(b)  : s(b.replace(b.substring(m), ''));
            return m[m.length - 1]
        }
        function n() {
            p.visible();
            p.hide();
            clearTimeout(t);
            k.removeClass(c.loadingClass);
            c.mustMatch && k.search(function (a) {
                a || (c.multiple ? (a = s(k.val()).slice(0, - 1), k.val(a.join(c.multipleSeparator) + (a.length ? c.multipleSeparator : '')))  : (k.val(''), k.trigger('result', null)))
            })
        }
        function g(f, g) {
            if (g && g.length && e) {
                k.removeClass(c.loadingClass);
                p.display(g, f);
                var t = g[0].value;
                c.autoFill && h(k.val()).toLowerCase() == f.toLowerCase() &&
                m != b.BACKSPACE && (k.val(k.val() + t.substring(h(u).length)), d(a).selection(u.length, u.length + t.length));
                p.show()
            } else n()
        }
        function f(b, m, f) {
            c.matchCase || (b = b.toLowerCase());
            var g = r.load(b);
            var preg = /^[A-Za-z]+$/;

            if (b.length == 3 && preg.test(b)) {
                // 过滤掉 g 中 三字码不包含 b 的元素
                var newDD = [];
                for (var ik = 0;ik < g.length; ik++){
                    if (g[ik].data[0].toLowerCase() === b) {
                         newDD[0] = g[ik];
                    }
                }

                g = newDD;
            }

            if (g && g.length) m(b, g),
                k.trigger('error', !1);
            else if ('string' == typeof c.url && 0 < c.url.length) {
                var e = {
                    timestamp: + new Date
                };
                d.each(c.extraParams, function (a, b) {
                    e[a] = 'function' == typeof b ? b()  : b
                });
                d.ajax({
                    mode: 'abort',
                    port: 'autocomplete' + a.name,
                    dataType: c.dataType,
                    url: c.url,
                    data: d.extend({
                        q: h(b),
                        limit: c.max
                    }, e),
                    success: function (a) {
                        var g;
                        if (!(g = c.parse && c.parse(a))) {
                            g = [
                            ];
                            a = a.split('\n');
                            for (var f = 0; f < a.length; f++) {
                                var e = d.trim(a[f]);
                                e && (e = e.split('|'), g[g.length] = {
                                    data: e,
                                    value: e[0],
                                    result: c.formatResult && c.formatResult(e, e[0]) || e[0]
                                })
                            }
                        }
                        r.add(b, g);
                        m(b, g)
                    }
                })
            } else p.emptyList(),
                f(b),
                k.trigger('error', !0)
        }
        var b = {
                UP: 38,
                DOWN: 40,
                DEL: 46,
                TAB: 9,
                RETURN: 13,
                ESC: 27,
                COMMA: 188,
                PAGEUP: 33,
                PAGEDOWN: 34,
                BACKSPACE: 8
            },
            k = d(a).attr('autocomplete', 'off').addClass(c.inputClass),
            t,
            u = '',
            r = d.Autocompleter.Cache(c),
            e = 0,
            m,
            x = {
                mouseDownOnSelect: !1
            },
            p = d.Autocompleter.Select(c, a, q, x),
            w;
        /opera/.test(navigator.userAgent.toLowerCase()) && d(a.form).bind('submit.autocomplete', function () {
            if (w) return w = !1
        });
        k.bind((/opera/.test(navigator.userAgent.toLowerCase()) ? 'keypress' : 'keydown') + '.autocomplete', function (a) {
            e = 1;
            m = a.keyCode;
            switch (a.keyCode) {
                case b.UP:
                    a.preventDefault();
                    p.visible() ? p.prev()  : l(0, !0);
                    break;
                case b.DOWN:
                    a.preventDefault();
                    p.visible() ? p.next()  : l(0, !0);
                    break;
                case b.PAGEUP:
                    a.preventDefault();
                    p.visible() ? p.pageUp()  : l(0, !0);
                    break;
                case b.PAGEDOWN:
                    a.preventDefault();
                    p.visible() ?
                        p.pageDown()  : l(0, !0);
                    break;
                case c.multiple && ',' == d.trim(c.multipleSeparator) && b.COMMA:
                case b.TAB:
                case b.RETURN:
                    if (q()) return a.preventDefault(),
                        w = !0,
                        !1;
                    break;
                case b.ESC:
                    p.hide();
                    break;
                default:
                    clearTimeout(t),
                        t = setTimeout(l, c.delay)
            }
        }).focus(function () {
            e++
        }).blur(function () {
            e = 0;
            x.mouseDownOnSelect || (clearTimeout(t), t = setTimeout(n, 200))
        }).click(function () {
            1 < e++ && !p.visible() && l(0, !0)
        }).bind('search', function () {
            function a(c, m) {
                var g;
                if (m && m.length) for (var e = 0; e < m.length; e++) if (m[e].result.toLowerCase() ==
                    c.toLowerCase()) {
                    g = m[e];
                    break
                }
                'function' == typeof b ? b(g)  : k.trigger('result', g && [g.data,
                        g.value])
            }
            var b = 1 < arguments.length ? arguments[1] : null;
            d.each(s(k.val()), function (b, c) {
                f(c, a, a)
            })
        }).bind('flushCache', function () {
            r.flush()
        }).bind('setOptions', function (a, b) {
            d.extend(c, b);
            'data' in b && r.populate()
        }).bind('unautocomplete', function () {
            p.unbind();
            k.unbind();
            d(a.form).unbind('.autocomplete')
        }); k.bind('input', function () {
            l(0, !0)
        })
    };
    d.Autocompleter.defaults = {
        inputClass: 'ac_input',
        resultsClass: 'ac_results',
        loadingClass: 'ac_loading',
        minChars: 1,
        delay: 400,
        matchCase: !1,
        matchSubset: !0,
        matchContains: !1,
        cacheLength: 10,
        max: 100,
        mustMatch: !1,
        extraParams: {
        },
        selectFirst: !0,
        formatItem: function (a) {
            return a[0]
        },
        formatMatch: null,
        autoFill: !1,
        width: 0,
        top: 0,
        multiple: !1,
        multipleSeparator: ', ',
        highlight: function (a, c) {
            return a.replace(RegExp('(?![^&;]+;)(?!<[^<>]*)(' + c.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, '\\$1') + ')(?![^<>]*>)(?![^&;]+;)', 'gi'), '<strong>$1</strong>')
        },
        scroll: !0,
        scrollHeight: 180
    };
    d.Autocompleter.Cache = function (a) {
        function c(c, f) {
            a.matchCase || (c = c.toLowerCase());
            var b = c.indexOf(f);
            'word' == a.matchContains && (b = c.toLowerCase().search('\\b' + f.toLowerCase()));
            return - 1 == b ? !1 : 0 == b || a.matchContains
        }
        function q(c, f) {
            n > a.cacheLength && s();
            h[c] || n++;
            h[c] = f
        }
        function l() {
            if (!a.data) return !1;
            var c = {
                },
                f = 0;
            a.url || (a.cacheLength = 1);
            c[''] = [
            ];
            for (var b = 0, k = a.data.length; b < k; b++) {
                var h = a.data[b],
                    h = 'string' == typeof h ? [
                        h
                    ] : h,
                    n = a.formatMatch(h, b + 1, a.data.length);
                if (!1 !== n) {
                    var l = n.charAt(0).toLowerCase();
                    c[l] || (c[l] = [
                    ]);
                    h = {
                        value: n,
                        data: h,
                        result: a.formatResult &&
                        a.formatResult(h) || n
                    };
                    c[l].push(h);
                    f++ < a.max && c[''].push(h)
                }
            }
            d.each(c, function (c, b) {
                a.cacheLength++;
                q(c, b)
            })
        }
        function s() {
            h = {
            };
            n = 0
        }
        var h = {
            },
            n = 0;
        setTimeout(l, 25);
        return {
            flush: s,
            add: q,
            populate: l,
            load: function (g) {
                if (!a.cacheLength || !n) return null;
                if (!a.url && a.matchContains) {
                    var f = [
                        ],
                        b;
                    for (b in h) if (0 < b.length) {
                        var k = h[b];
                        d.each(k, function (a, b) {
                            c(b.value, g) && f.push(b)
                        })
                    }
                    return f
                }
                if (h[g]) return h[g];
                if (a.matchSubset) for (b = g.length - 1; b >= a.minChars; b--) if (k = h[g.substr(0, b)]) return f = [
                ],
                    d.each(k, function (a, b) {
                        c(b.value, g) && (f[f.length] = b)
                    }),
                    f;
                return null
            }
        }
    };
    d.Autocompleter.Select = function (a, c, q, l) {
        function s() {
            u && (r = d('<div/>').hide().addClass(a.resultsClass).css('position', 'absolute').appendTo(document.body), e = d('<ul/>').appendTo(r).mouseover(function (a) {
                h(a).nodeName && 'LI' == h(a).nodeName.toUpperCase() && (b = d('li', e).removeClass(g.ACTIVE).index(h(a)), d(h(a)).addClass(g.ACTIVE))
            }).click(function (a) {
                d(h(a)).addClass(g.ACTIVE);
                q();
                //c.focus();
                return !1
            }).mousedown(function () {
                l.mouseDownOnSelect = !0
            }).mouseup(function () {
                l.mouseDownOnSelect =
                    !1
            }), u = !1)
        }
        function h(a) {
            for (a = a.target; a && 'LI' != a.tagName; ) a = a.parentNode;
            return a ? a : [
            ]
        }
        function n(c) {
            f.slice(b, b + 1).removeClass(g.ACTIVE);
            b += c;
            0 > b ? b = f.size() - 1 : b >= f.size() && (b = 0);
            c = f.slice(b, b + 1).addClass(g.ACTIVE);
            if (a.scroll) {
                var d = 0;
                f.slice(0, b).each(function () {
                    d += this.offsetHeight
                });
                d + c[0].offsetHeight - e.scrollTop() > e[0].clientHeight ? e.scrollTop(d + c[0].offsetHeight - e.innerHeight())  : d < e.scrollTop() && e.scrollTop(d)
            }
        }
        var g = {
                ACTIVE: 'ac_over'
            },
            f,
            b = - 1,
            k,
            t = '',
            u = !0,
            r,
            e;
        return {
            display: function (c, h) {
                s();
                k = c;
                t = h;
                e.empty();
                for (var n = a.max && a.max < k.length ? a.max : k.length, l = 0; l < n; l++) if (k[l]) {
                    var q = a.formatItem(k[l].data, l + 1, n, k[l].value, t);
                    !1 !== q && (q = d('<li/>').html(a.highlight(q, t)).addClass(0 == l % 2 ? 'ac_even' : 'ac_odd').appendTo(e) [0], d.data(q, 'ac_data', k[l]))
                }
                f = e.find('li');
                a.selectFirst && (f.slice(0, 1).addClass(g.ACTIVE), b = 0);
                d.fn.bgiframe && e.bgiframe()
            },
            next: function () {
                n(1)
            },
            prev: function () {
                n( - 1)
            },
            pageUp: function () {
                0 != b && 0 > b - 8 ? n( - b)  : n( - 8)
            },
            pageDown: function () {
                b != f.size() - 1 && b + 8 > f.size() ? n(f.size() -
                    1 - b)  : n(8)
            },
            hide: function () {
                r && r.hide();
                f && f.removeClass(g.ACTIVE);
                b = - 1
            },
            visible: function () {
                return r && r.is(':visible')
            },
            current: function () {
                return this.visible() && (f.filter('.' + g.ACTIVE) [0] || a.selectFirst && f[0])
            },
            show: function () {
                var b = d(c).offset();
                r.css({
                    top: 'string' == typeof a.top || 0 < a.top ? a.top : b.top + c.offsetHeight,
                    left: b.left + ('undefined' != typeof a.left ? parseInt(a.left)  : 0)
                }).show();
                if (a.scroll && (e.scrollTop(0), e.css({
                        maxHeight: a.scrollHeight,
                        overflow: 'auto'
                    }), /msie/.test(navigator.userAgent.toLowerCase()) &&
                    'undefined' === typeof document.body.style.maxHeight)) {
                    var g = 0;
                    f.each(function () {
                        g += this.offsetHeight
                    });
                    b = g > a.scrollHeight;
                    e.css('height', b ? a.scrollHeight : g);
                    b || f.width(e.width() - parseInt(f.css('padding-left')) - parseInt(f.css('padding-right')))
                }
            },
            selected: function () {
                var a = f && f.filter('.' + g.ACTIVE).removeClass(g.ACTIVE);
                return a && a.length && d.data(a[0], 'ac_data')
            },
            emptyList: function () {
                e && e.empty()
            },
            unbind: function () {
                r && r.remove()
            }
        }
    };
    d.fn.selection = function (a, c) {
        if (void 0 !== a) return this.each(function () {
            if (this.createTextRange) {
                var d =
                    this.createTextRange();
                void 0 === c || a == c ? d.move('character', a)  : (d.collapse(!0), d.moveStart('character', a), d.moveEnd('character', c));
                d.select()
            } else this.setSelectionRange ? this.setSelectionRange(a, c)  : this.selectionStart && (this.selectionStart = a, this.selectionEnd = c)
        });
        var d = this[0];
        if (d.createTextRange) {
            var l = document.selection.createRange(),
                s = d.value,
                h = l.text.length;
            l.text = '<->';
            l = d.value.indexOf('<->');
            d.value = s;
            this.selection(l, l + h);
            return {
                start: l,
                end: l + h
            }
        }
        if (void 0 !== d.selectionStart) return {
            start: d.selectionStart,
            end: d.selectionEnd
        }
    }
}) (jQuery);
