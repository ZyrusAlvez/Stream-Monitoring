import streamlit as st

st.title("Select a Website Source")

col1, col2, col3 = st.columns(3)

st.set_page_config(initial_sidebar_state="collapsed")
hide_sidebar = """
    <style>
        section[data-testid="stSidebar"] {display: none !important;}
        div[data-testid="stSidebarNav"] {display: none !important;}
        button[kind="headerNoPadding"] {display: none !important;}
    </style>
"""
st.markdown(hide_sidebar, unsafe_allow_html=True)



with col1:
    if st.button("iptv-org.github"):
        st.switch_page("pages/IptvOrg.py")

with col2:
    if st.button("tv.garden"):
        st.switch_page("pages/TVGarden.py")

with col3:
    if st.button("radio.garden"):
        st.switch_page("pages/RadioGarden.py")
